"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  RestaurantMenu,
  Restaurant,
  Cake,
  LocalDrink,
  Search,
  ShoppingCart,
  Receipt,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Components
import MenuItemCard from "@/components/menu/MenuItemCard";
import CartSidebar from "@/components/menu/CartSidebar";
import OrderTracking from "@/components/menu/OrderTracking";
import PaymentPage from "@/components/menu/PaymentPage";
import LoadingSkeleton from "@/components/menu/LoadingSkeleton";
import VegNonVegFilter from "@/components/menu/VegNonVegFilter";

// Store
import { useCartStore, MenuItemType } from "@/lib/store/cartStore";

// API
import {
  customerService,
  ApiMenuItem,
} from "@/lib/api/services/customer.service";

// Types
type PageView = "menu" | "orders" | "payment";

// Category type for dynamic categories
type CategoryType = {
  id: string;
  name: string;
  icon: React.ElementType;
};

// Menu data type
type MenuDataType = {
  categories: CategoryType[];
  items: MenuItemType[];
};

function getMenuItemCategoryId(item: MenuItemType) {
  if (item.categoryId) return item.categoryId;
  if (typeof item.category === "string") return item.category;
  return item.category?.id ?? "";
}

// Helper function to map API menu item to MenuItemType
// This transforms API response format to match cart store's MenuItemType
function mapApiMenuItemToMenuItemType(apiItem: ApiMenuItem): MenuItemType {
  const apiImageItem = apiItem as any;
  const sourceImages = apiItem.images || apiImageItem.imageUrls || [];
  const firstImage =
    apiItem.images?.[0] ||
    (sourceImages[0]
      ? { url: sourceImages[0].url, type: sourceImages[0].type || "primary" }
      : undefined) ||
    (apiImageItem.imageUrl
      ? { url: apiImageItem.imageUrl, type: "primary" }
      : undefined);

  return {
    id: apiItem.id,
    name: apiItem.name,
    description: apiItem.description || "",
    price: apiItem.price,
    // Extract category fields for cart store compatibility
    categoryId: apiItem.category?.id,
    categoryName: apiItem.category?.name,
    category: apiItem.category,
    // Map images array to both image (single) and images (array) fields
    image: firstImage?.url || "",
    images:
      sourceImages?.map((img) => ({
        url: img.url,
        type: (img.type as "primary" | "thumbnail" | "gallery") || "primary",
      })) || [],
    // Availability and dietary info
    isAvailable: apiItem.isAvailable !== false,
    isVegetarian: apiItem.isVegetarian || false,
    isVegan: apiItem.isVegan || false,
    isGlutenFree: apiItem.isGlutenFree || false,
    allergens: apiItem.allergens || [],
    // Additional fields
    preparationTime: apiItem.preparationTime,
    variants: apiItem.variants || [],
    addOns: apiItem.addOns || [],
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
  };
}

// Left Sidebar Component
function CategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  categoryCounts,
}: {
  categories: CategoryType[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  categoryCounts: Record<string, number>;
}) {
  return (
    <Box
      sx={{
        width: 240,
        minWidth: 240,
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: 64,
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
        overflowY: "auto",
        py: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          px: 2,
          pb: 1,
          color: "#666666",
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: 1,
        }}
      >
        Categories
      </Typography>
      <List sx={{ px: 1 }}>
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          return (
            <ListItem key={category.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => onCategorySelect(category.id)}
                sx={{
                  py: 1,
                  "&.Mui-selected": {
                    backgroundColor: "#8B0000",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#6B0000",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                      fontWeight: 600,
                    },
                  },
                  "&:hover": {
                    backgroundColor: isSelected ? "#8B0000" : "#F3F4F6",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isSelected ? "white" : "#333333",
                  }}
                >
                  <IconComponent sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={category.name}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.9rem",
                        fontWeight: isSelected ? 600 : 400,
                      },
                    },
                  }}
                />
                <Chip
                  label={categoryCounts[category.id] || 0}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: isSelected
                      ? "rgba(255,255,255,0.2)"
                      : "#F3F4F6",
                    color: isSelected ? "white" : "#333333",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Header Skeleton */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1100,
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: { xs: 2, md: 3 },
                py: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: "#8B0000",
                }}
              />
              <Box sx={{ flex: 1, maxWidth: 500 }}>
                <Box
                  sx={{
                    height: 40,
                    borderRadius: 3,
                    backgroundColor: "#F3F4F6",
                  }}
                />
              </Box>
            </Box>
          </Box>
          {/* Content Skeleton */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                height: 40,
                width: 200,
                borderRadius: 2,
                backgroundColor: "#F3F4F6",
                mb: 3,
              }}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  sx={{
                    height: 200,
                    borderRadius: 2,
                    backgroundColor: "#F3F4F6",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      }
    >
      <MenuComponent />
    </Suspense>
  );
}

function MenuComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchParams = useSearchParams();

  // Cart store
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getTotalPrice());
  const cartOpen = useCartStore((state) => state.isOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  // Menu data state
  const [menuData, setMenuData] = useState<MenuDataType>({
    categories: [{ id: "all", name: "All", icon: RestaurantMenu }],
    items: [],
  });

  // Local state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<PageView>("menu");
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [isVegOnly, setIsVegOnly] = useState(false);

  // Fetch menu data based on QR code
  useEffect(() => {
    const fetchMenuData = async () => {
      const qrCode = searchParams.get("qr");

      if (qrCode) {
        setIsLoading(true);
        try {
          const response = await customerService.getMenuByQr(qrCode);
          console.log("API Response:", response);
          if (response.success && response.data) {
            // response.data is MenuApiResponse which has { success, data: { items, organisation } }
            const menuItems = (response.data as any)?.items || [];

            // Map API items to MenuItemType
            const mappedItems = menuItems.map((item: ApiMenuItem) =>
              mapApiMenuItemToMenuItemType(item),
            );

            // Extract unique categories from API response
            const categoryMap = new Map<string, string>();
            mappedItems.forEach((item: MenuItemType) => {
              const categoryId = getMenuItemCategoryId(item);
              const categoryName =
                item.categoryName ||
                (typeof item.category === "string"
                  ? item.category
                  : item.category?.name) ||
                categoryId;

              if (categoryId && !categoryMap.has(categoryId)) {
                categoryMap.set(categoryId, categoryName);
              }
            });

            // Build categories array with icons
            const categories: CategoryType[] = [
              { id: "all", name: "All", icon: RestaurantMenu },
              ...Array.from(categoryMap.entries()).map(([id, name]) => ({
                id,
                name,
                icon: RestaurantMenu,
              })),
            ];
            console.log(JSON.stringify(mappedItems));

            setMenuData({
              categories,
              items: mappedItems,
            });
          }
        } catch (error) {
          console.error("Failed to fetch menu from API:", error);
          // On error, keep showing empty state with categories
          setMenuData({
            categories: [{ id: "all", name: "All", icon: RestaurantMenu }],
            items: [],
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // No QR code, show empty state
        setMenuData({
          categories: [{ id: "all", name: "All", icon: RestaurantMenu }],
          items: [],
        });
      }
    };

    fetchMenuData();
  }, [searchParams]);

  // Filtered items with category sorting
  const filteredItems = useMemo(() => {
    let items =
      selectedCategory === "all"
        ? [...menuData.items]
        : menuData.items.filter(
            (item) => getMenuItemCategoryId(item) === selectedCategory,
          );

    if (selectedCategory === "all") {
      const categoryOrder = menuData.categories.map((c) => c.id);
      items.sort((a, b) => {
        const aIndex = categoryOrder.indexOf(getMenuItemCategoryId(a));
        const bIndex = categoryOrder.indexOf(getMenuItemCategoryId(b));
        return aIndex - bIndex;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    if (isVegOnly) {
      items = items.filter((item) => item.isVegetarian ?? item.isVeg ?? false);
    }

    return items;
  }, [selectedCategory, searchQuery, isVegOnly, menuData.items]);

  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };

    // Filter items by veg if filter is applied
    const itemsToCount = isVegOnly
      ? menuData.items.filter((item) => item.isVegetarian ?? item.isVeg)
      : menuData.items;

    counts.all = itemsToCount.length;

    itemsToCount.forEach((item) => {
      const categoryId = getMenuItemCategoryId(item);
      if (!categoryId) return;
      counts[categoryId] = (counts[categoryId] || 0) + 1;
    });
    return counts;
  }, [isVegOnly, menuData.items]);

  // Handlers
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCurrentView("payment");
  };

  const handlePaymentSuccess = () => {
    useCartStore.getState().clearCart();
    setCurrentView("menu");
    setBottomNavValue(0);
  };

  const handleBackToMenu = () => {
    setCurrentView("menu");
  };

  const handleBottomNavChange = (_: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
    if (newValue === 0) setCurrentView("menu");
    if (newValue === 2) handleCartOpen();
    if (newValue === 1) setCurrentView("orders");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        color: "#111111",
      }}
    >
      {/* Header - Simplified on payment page */}
      {currentView === "payment" ? (
        /* Simplified Header - Only Company Name */
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              px: { xs: 2, md: 3 },
              py: 1.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: "#8B0000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              QQ
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                lineHeight: 1.2,
                color: "#111111",
              }}
            >
              QueueQuell
            </Typography>
          </Box>
        </Box>
      ) : (
        /* Full Header with Search, Filter, and Cart */
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: { xs: 2, md: 3 },
              py: 1.5,
            }}
          >
            {/* Menu Button (Mobile) */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minWidth: "fit-content",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: "#8B0000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                QQ
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    lineHeight: 1.2,
                    color: "#111111",
                  }}
                >
                  QueueQuell
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#666666",
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  Fresh & Delicious
                </Typography>
              </Box>
            </Box>

            {/* Search Bar */}
            <Box sx={{ flex: 1, maxWidth: 500 }}>
              <TextField
                fullWidth
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#F3F4F6",
                    color: "#111111",
                    "&:hover": {
                      backgroundColor: "#F3F4F6",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 0 0 2px #8B0000",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#666666",
                      opacity: 1,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#8B0000",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#666666", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery("")}
                        >
                          <Close sx={{ fontSize: 18, color: "#666666" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Desktop: Filter & Cart side by side */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VegNonVegFilter
                  isVegOnly={isVegOnly}
                  onVegChange={setIsVegOnly}
                />

                <IconButton
                  onClick={handleCartOpen}
                  sx={{
                    backgroundColor: "#F3F4F6",
                    color: "#333333",
                    "&:hover": {
                      backgroundColor: "#8B0000",
                      color: "#fff",
                    },
                  }}
                >
                  <Badge
                    badgeContent={cartItems.reduce((s, i) => s + i.quantity, 0)}
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.65rem",
                        height: 18,
                        minWidth: 18,
                      },
                    }}
                  >
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Mobile: Veg Filter below search */}
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
                px: { xs: 2, md: 3 },
              }}
            >
              <VegNonVegFilter
                isVegOnly={isVegOnly}
                onVegChange={setIsVegOnly}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Mobile Category Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
      >
        <CategorySidebar
          categories={menuData.categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          categoryCounts={categoryCounts}
        />
      </SwipeableDrawer>

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Left Sidebar (Desktop) - Hide on payment page */}
        {!isMobile && currentView !== "payment" && (
          <CategorySidebar
            categories={menuData.categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            categoryCounts={categoryCounts}
          />
        )}

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: "auto", pb: isMobile ? 8 : 0 }}>
          {currentView === "menu" && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {/* Results Count */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#111111",
                  }}
                >
                  {selectedCategory === "all"
                    ? "All Items"
                    : menuData.categories.find((c) => c.id === selectedCategory)
                        ?.name}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: "#666666",
                      fontWeight: 400,
                    }}
                  >
                    ({filteredItems.length} items)
                  </Typography>
                </Typography>
              </Box>

              {/* Menu Items Grid */}
              {isLoading ? (
                <LoadingSkeleton type="menu-item" count={4} />
              ) : filteredItems.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    color: "#666666",
                  }}
                >
                  <Search sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ mb: 1, color: "#333333" }}>
                    No items found
                  </Typography>
                  <Typography variant="body2">
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr",
                      md: "repeat(2, 1fr)",
                    },
                    gap: 3,
                  }}
                >
                  <AnimatePresence>
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <MenuItemCard item={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              )}
            </Box>
          )}

          {currentView === "orders" && <OrderTracking />}

          {currentView === "payment" && (
            <PaymentPage
              cart={cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
              }))}
              totalAmount={cartTotal}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={handleBackToMenu}
            />
          )}
        </Box>
      </Box>

      {/* Cart Sidebar */}
      <CartSidebar
        open={cartOpen}
        onClose={handleCartClose}
        onCheckout={handleCheckout}
      />

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
          }}
          elevation={3}
        >
          <BottomNavigation
            value={bottomNavValue}
            onChange={handleBottomNavChange}
            showLabels
          >
            <BottomNavigationAction label="Menu" icon={<RestaurantMenu />} />
            <BottomNavigationAction label="Orders" icon={<Receipt />} />
            <BottomNavigationAction
              label="Cart"
              icon={
                <Badge
                  badgeContent={cartItems.reduce((s, i) => s + i.quantity, 0)}
                  color="error"
                >
                  <ShoppingCart />
                </Badge>
              }
            />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
