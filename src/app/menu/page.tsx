"use client";
import { useState } from "react";
import { Box, useMediaQuery, useTheme, SwipeableDrawer } from "@mui/material";
import { Restaurant, RestaurantMenu, Cake, LocalDrink } from "@mui/icons-material";
import Footer from "../components/navigation/Footer";
import MenuHeader from "../components/menu/MenuHeader";
import MenuCategories from "../components/menu/MenuCategories";
import MenuItems from "../components/menu/MenuItems";
import CartDrawer from "../components/menu/CartDrawer";
import CheckoutDialog from "../components/menu/CheckoutDialog";

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

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    setCart([]);
    setCheckoutOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MenuHeader
        totalItems={totalItems}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={() => setCheckoutOpen(true)}
        onMenuClick={() => setDrawerOpen(true)}
        isSmallScreen={isSmallScreen}
      />

      {isSmallScreen && (
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
        >
          <MenuCategories
            categories={menuData.categories}
            selectedCategory={selectedCategory}
            onCategorySelect={(categoryId) => {
              setSelectedCategory(categoryId);
              setDrawerOpen(false);
            }}
          />
        </SwipeableDrawer>
      )}

      <Box sx={{ display: "flex", flex: 1 }}>
        {!isSmallScreen && (
          <MenuCategories
            categories={menuData.categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        )}

        <MenuItems
          items={filteredItems}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddToCart={addToCart}
          isSmallScreen={isSmallScreen}
        />
      </Box>

      {cart.length > 0 && (
        <CartDrawer
          cart={cart}
          totalPrice={totalPrice}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onCheckout={() => setCheckoutOpen(true)}
        />
      )}

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        totalPrice={totalPrice}
        onPlaceOrder={handlePlaceOrder}
      />

      <Footer />
    </Box>
  );
}
