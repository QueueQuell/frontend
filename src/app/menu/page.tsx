"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Stack,
  Drawer,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Restaurant, Grass, Whatshot, RestaurantMenu, Cake, LocalDrink, ShoppingCart, Add, Remove, Search, Menu } from "@mui/icons-material";
import Footer from "../components/Footer";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  weight: string;
  isVeg: boolean;
  image: string;
  description: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// Mock data for menu items
const menuData = {
  categories: [
    { id: "all", name: "All", icon: RestaurantMenu },
    { id: "appetizers", name: "Appetizers", icon: RestaurantMenu },
    { id: "main-courses", name: "Main Courses", icon: Restaurant },
    { id: "desserts", name: "Desserts", icon: Cake },
    { id: "beverages", name: "Beverages", icon: LocalDrink },
  ],
  items: [
    {
      id: 1,
      name: "Chicken Wings",
      category: "appetizers",
      price: 12.99,
      weight: "500g",
      isVeg: false,
      image: "https://foodess.com/wp-content/uploads/2023/02/Butter-Naan-3.jpg",
      description: "Crispy fried chicken wings with buffalo sauce",
    },
    {
      id: 2,
      name: "Caesar Salad",
      category: "appetizers",
      price: 8.99,
      weight: "300g",
      isVeg: true,
      image: "https://foodess.com/wp-content/uploads/2023/02/Butter-Naan-3.jpg",
      description: "Fresh romaine lettuce with caesar dressing",
    },
    {
      id: 3,
      name: "Grilled Salmon",
      category: "main-courses",
      price: 24.99,
      weight: "250g",
      isVeg: false,
      image: "https://foodess.com/wp-content/uploads/2023/02/Butter-Naan-3.jpg",
      description: "Fresh Atlantic salmon grilled to perfection",
    },
    {
      id: 4,
      name: "Vegetable Stir Fry",
      category: "main-courses",
      price: 16.99,
      weight: "400g",
      isVeg: true,
      image: "https://foodess.com/wp-content/uploads/2023/02/Butter-Naan-3.jpg",
      description: "Mixed vegetables stir-fried with soy sauce",
    },
    {
      id: 5,
      name: "Chocolate Cake",
      category: "desserts",
      price: 6.99,
      weight: "150g",
      isVeg: true,
      image: "https://foodess.com/wp-content/uploads/2023/02/Butter-Naan-3.jpg",
      description: "Rich chocolate cake with vanilla frosting",
    },
    {
      id: 6,
      name: "Cappuccino",
      category: "beverages",
      price: 4.99,
      weight: "250ml",
      isVeg: true,
      image: "https://foodess.com/wp-content/uploads/2023/02/Butter-Naan-3.jpg",
      description: "Espresso with steamed milk and foam",
    },
  ],
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("appetizers");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const filteredItems = (selectedCategory === "all" ? menuData.items : menuData.items.filter(
    (item) => item.category === selectedCategory
  )).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            {isSmallScreen && (
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
                <Menu />
              </IconButton>
            )}
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Box
                component="img"
                src="https://www.haldirams.com/media/logo/stores/1/Delhi_Haldiram_Logo_1_.png"
                alt="Restaurant Logo"
                sx={{ height: 40, mr: 2 }}
              />
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                QueueQuell
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={() => setCheckoutOpen(true)}>
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

      {isSmallScreen && (
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
        >
          <Box sx={{ width: 200, bgcolor: "background.paper" }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
              Categories
            </Typography>
            <Divider />
            <List>
              {menuData.categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <ListItem key={category.id} disablePadding>
                    <ListItemButton
                      selected={selectedCategory === category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setDrawerOpen(false);
                      }}
                    >
                      <IconComponent sx={{ mr: 1 }} />
                      <ListItemText primary={category.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </SwipeableDrawer>
      )}

      {/* Main Content */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Left Sidebar - Categories */}
        {!isSmallScreen && (
          <Box
            sx={{
              width: 200,
              borderRight: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
              Categories
            </Typography>
            <Divider />
            <List>
              {menuData.categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <ListItem key={category.id} disablePadding>
                    <ListItemButton
                      selected={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <IconComponent sx={{ mr: 1 }} />
                      <ListItemText primary={category.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}

        {/* Main Content - Menu Items */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" sx={{ flex: 1 }}>
              {menuData.categories.find((cat) => cat.id === selectedCategory)?.name}
            </Typography>
            <TextField
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
              }}
              sx={{ width: isSmallScreen ? 200 : 300 }}
              size="small"
            />
          </Box>
          <Grid container spacing={3}>
            {filteredItems.map((item) => (
              <Grid size={{ xs: 12 }} key={item.id}>
                <Card sx={{ height: "100%", display: "flex" }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{ width: 140, height: 140, objectFit: "cover" }}
                  />
                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="h6" sx={{ flex: 1 }}>
                        {item.name}
                      </Typography>
                      <IconButton size="small">
                        {item.isVeg ? (
                          <Grass color="success" />
                        ) : (
                          <Whatshot color="error" />
                        )}
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Chip label={`${item.weight}`} size="small" />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" color="primary">
                          ₹{item.price}
                        </Typography>
                        <Button variant="contained" size="small" onClick={() => addToCart(item)}>
                          Add to Cart
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Cart Items Horizontal Queue */}
      {cart.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            overflowX: "auto",
            maxHeight: 120,
          }}
        >
          <Typography variant="h6" sx={{ minWidth: "fit-content" }}>
            Cart ({totalItems} items):
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flex: 1, overflowX: "auto" }}>
            {cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 200,
                  p: 1,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Avatar src={item.image} sx={{ width: 40, height: 40 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ₹{item.price} x {item.quantity}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                <IconButton size="small" onClick={() => removeFromCart(item.id)}>
                  <Whatshot color="error" fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: "fit-content" }}>
            <Typography variant="h6" color="primary">
              Total: ₹{totalPrice.toFixed(2)}
            </Typography>
            <Button variant="contained" onClick={() => setCheckoutOpen(true)}>
              Checkout
            </Button>
          </Box>
        </Box>
      )}

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          {cart.map((item) => (
            <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography>₹{(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              ₹{totalPrice.toFixed(2)}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Customer Name"
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone Number"
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            alert("Order placed successfully!");
            setCart([]);
            setCheckoutOpen(false);
          }}>
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}
