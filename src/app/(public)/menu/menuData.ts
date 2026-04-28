import { MenuItemType } from "@/lib/store/cartStore";
import { RestaurantMenu, Restaurant, LocalDining } from "@mui/icons-material";

// Menu categories
export const menuCategories = [
  { id: "all", name: "All", icon: RestaurantMenu },
  { id: "CA000001", name: "Pizza", icon: LocalDining },
  { id: "CA000002", name: "Burgers", icon: Restaurant },
];

// Mock menu items for testing
export const menuItems: MenuItemType[] = [
  {
    id: "ME000101",
    name: "Margherita Pizza",
    description: "Tomato sauce, mozzarella, fresh basil, and olive oil",
    price: 499.0,
    categoryId: "CA000001",
    categoryName: "Pizza",
    category: {
      id: "CA000001",
      name: "Pizza",
    },
    image: "https://cdn.example.com/menu/margherita.jpg",
    images: [
      {
        url: "https://cdn.example.com/menu/margherita.jpg",
        type: "primary",
      },
      {
        url: "https://cdn.example.com/menu/margherita-side.jpg",
        type: "gallery",
      },
    ],
    isAvailable: true,
    preparationTime: 20,
    allergens: ["Gluten", "Dairy"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    variants: [
      { id: "VG0001", name: "Small", priceModifier: 0, isDefault: true },
      { id: "VG0002", name: "Medium", priceModifier: 150, isDefault: false },
      { id: "VG0003", name: "Large", priceModifier: 300, isDefault: false },
    ],
    addOns: [
      { id: "AD0001", name: "Extra Cheese", price: 80, isAvailable: true },
      { id: "AD0002", name: "Olives", price: 50, isAvailable: true },
    ],
    createdAt: "2026-04-17T10:10:00.000Z",
    updatedAt: "2026-04-17T10:10:00.000Z",
    isVeg: true,
  },
  {
    id: "ME000102",
    name: "Spicy Chicken Burger",
    description: "Crispy chicken patty, jalapeño mayo, lettuce, and tomato",
    price: 349.0,
    categoryId: "CA000002",
    categoryName: "Burgers",
    category: {
      id: "CA000002",
      name: "Burgers",
    },
    image: "https://cdn.example.com/menu/spicy-chicken-burger.jpg",
    images: [
      {
        url: "https://cdn.example.com/menu/spicy-chicken-burger.jpg",
        type: "primary",
      },
    ],
    isAvailable: true,
    preparationTime: 15,
    allergens: ["Gluten"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    variants: [
      { id: "VG0004", name: "Single Patty", priceModifier: 0, isDefault: true },
      {
        id: "VG0005",
        name: "Double Patty",
        priceModifier: 120,
        isDefault: false,
      },
    ],
    addOns: [
      { id: "AD0003", name: "Fries", price: 89, isAvailable: true },
      { id: "AD0004", name: "Coleslaw", price: 49, isAvailable: true },
    ],
    createdAt: "2026-04-17T10:15:00.000Z",
    updatedAt: "2026-04-17T10:15:00.000Z",
    isVeg: false,
  },
  {
    id: "ME000103",
    name: "Vegan Delight Pizza",
    description: "Plant-based cheese, vegetables, and tomato base",
    price: 559.0,
    categoryId: "CA000001",
    categoryName: "Pizza",
    category: {
      id: "CA000001",
      name: "Pizza",
    },
    image: "https://cdn.example.com/menu/vegan-delight.jpg",
    images: [
      {
        url: "https://cdn.example.com/menu/vegan-delight.jpg",
        type: "primary",
      },
    ],
    isAvailable: true,
    preparationTime: 22,
    allergens: ["Gluten"],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    variants: [
      { id: "VG0006", name: "Regular", priceModifier: 0, isDefault: true },
      { id: "VG0007", name: "Large", priceModifier: 250, isDefault: false },
    ],
    addOns: [
      {
        id: "AD0005",
        name: "Extra Vegan Cheese",
        price: 90,
        isAvailable: true,
      },
    ],
    createdAt: "2026-04-17T10:20:00.000Z",
    updatedAt: "2026-04-17T10:20:00.000Z",
    isVeg: true,
  },
];

// Export menu data as a single object
export const menuData = {
  categories: menuCategories,
  items: menuItems,
};
