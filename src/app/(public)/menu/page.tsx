"use client";

import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import MenuItemCard from '@/components/menu/MenuItemCard';
import CartSidebar from '@/components/menu/CartSidebar';
import OrderTracking from '@/components/menu/OrderTracking';
import PaymentPage from '@/components/menu/PaymentPage';
import LoadingSkeleton from '@/components/menu/LoadingSkeleton';
import VegNonVegFilter from '@/components/menu/VegNonVegFilter';

// Data
import { menuData } from './menuData';

// Store
import { useCartStore } from '@/lib/store/cartStore';

// Types
type PageView = 'menu' | 'orders' | 'payment';

// Left Sidebar Component
function CategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  categoryCounts,
}: {
  categories: typeof menuData.categories;
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  categoryCounts: Record<string, number>;
}) {
  return (
    <Box
      sx={{
        width: 240,
        minWidth: 240,
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        overflowY: 'auto',
        py: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          px: 2,
          pb: 1,
          color: '#666666',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
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
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#FF6B35',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'white',
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: isSelected ? '#FF6B35' : '#F3F4F6',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isSelected ? 'white' : '#333333',
                  }}
                >
                  <IconComponent sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                />
                <Chip
                  label={categoryCounts[category.id] || 0}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                    color: isSelected ? 'white' : '#333333',
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Cart store
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getTotalPrice());
  const cartOpen = useCartStore((state) => state.isOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  // Local state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<PageView>('menu');
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isNonVegOnly, setIsNonVegOnly] = useState(false);

  // Filtered items with category sorting
  const filteredItems = useMemo(() => {
    let items = selectedCategory === 'all' 
      ? [...menuData.items]
      : menuData.items.filter((item) => item.category === selectedCategory);

    if (selectedCategory === 'all') {
      const categoryOrder = menuData.categories.map(c => c.id);
      items.sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a.category);
        const bIndex = categoryOrder.indexOf(b.category);
        return aIndex - bIndex;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    if (isVegOnly) {
      items = items.filter((item) => item.isVeg);
    }
    if (isNonVegOnly) {
      items = items.filter((item) => !item.isVeg);
    }

    return items;
  }, [selectedCategory, searchQuery, isVegOnly, isNonVegOnly]);


  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: menuData.items.length };
    menuData.items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

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
    setCurrentView('payment');
  };

  const handlePaymentSuccess = () => {
    useCartStore.getState().clearCart();
    setCurrentView('menu');
    setBottomNavValue(0);
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  const handleBottomNavChange = (_: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
    if (newValue === 0) setCurrentView('menu');
    if (newValue === 2) handleCartOpen();
    if (newValue === 1) setCurrentView('orders');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        color: '#111111',
      }}
    >
      {/* Header with Search, Filter, and Cart */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
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
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              minWidth: 'fit-content',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#FF6B35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              QQ
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  color: '#111111',
                }}
              >
                QueueQuell
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#666666',
                  display: 'block',
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#F3F4F6',
                  color: '#111111',
                  '&:hover': {
                    backgroundColor: '#F3F4F6',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 0 0 2px #FF6B35',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#666666',
                    opacity: 1,
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E7EB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF6B35',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#666666', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <Close sx={{ fontSize: 18, color: '#666666' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Filter & Cart */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VegNonVegFilter
              isVegOnly={isVegOnly}
              isNonVegOnly={isNonVegOnly}
              onVegChange={setIsVegOnly}
              onNonVegChange={setIsNonVegOnly}
            />

            <IconButton
              onClick={handleCartOpen}
              sx={{
                backgroundColor: '#F3F4F6',
                color: '#333333',
                '&:hover': {
                  backgroundColor: '#FF6B35',
                  color: '#fff',
                },
              }}
            >
              <Badge
                badgeContent={cartItems.reduce((s, i) => s + i.quantity, 0)}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    height: 18,
                    minWidth: 18,
                  },
                }}
              >
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Box>
      </Box>

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
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar (Desktop) */}
        {!isMobile && (
          <CategorySidebar
            categories={menuData.categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            categoryCounts={categoryCounts}
          />
        )}

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', pb: isMobile ? 8 : 0 }}>
          {currentView === 'menu' && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {/* Results Count */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#111111',
                  }}
                >
                  {selectedCategory === 'all'
                    ? 'All Items'
                    : menuData.categories.find((c) => c.id === selectedCategory)?.name}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: '#666666',
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
                    textAlign: 'center',
                    py: 8,
                    color: '#666666',
                  }}
                >
                  <Search sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ mb: 1, color: '#333333' }}>
                    No items found
                  </Typography>
                  <Typography variant="body2">
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: '1fr',
                      md: 'repeat(2, 1fr)',
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

          {currentView === 'orders' && <OrderTracking />}

          {currentView === 'payment' && (
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
            position: 'fixed',
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
