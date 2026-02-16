import { MenuItemType } from '@/lib/store/cartStore';
import {
  RestaurantMenu,
  Restaurant,
  Cake,
  LocalDrink,
} from '@mui/icons-material';

// Menu categories
export const menuCategories = [
  { id: 'all', name: 'All', icon: RestaurantMenu },
  { id: 'starters', name: 'Starters', icon: RestaurantMenu },
  { id: 'main-course', name: 'Main Course', icon: Restaurant },
  { id: 'desserts', name: 'Desserts', icon: Cake },
  { id: 'beverages', name: 'Beverages', icon: LocalDrink },
];

// Mock menu items for testing
export const menuItems: MenuItemType[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    category: 'main-course',
    price: 349,
    weight: '400g',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    images: [
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    ],
    description: 'Tender chicken in creamy tomato-based gravy',
    isPremium: false,
    addons: [
      { id: 'a7', name: 'Extra Butter', price: 25 },
      { id: 'a8', name: 'Naan Bread', price: 40 },
    ],
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Caesar Salad',
    category: 'starters',
    price: 199,
    weight: '300g',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
    images: [
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
    ],
    description: 'Fresh romaine lettuce with creamy caesar dressing and parmesan',
    isPremium: false,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    category: 'main-course',
    price: 599,
    weight: '250g',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    images: [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    ],
    description: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon',
    isPremium: true,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    addons: [
      { id: 'a3', name: 'Extra Salmon', price: 200 },
      { id: 'a4', name: 'Garlic Bread', price: 50 },
    ],
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Vegetable Stir Fry',
    category: 'main-course',
    price: 249,
    weight: '400g',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    images: [
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    ],
    description: 'Fresh seasonal vegetables stir-fried with soy sauce and garlic',
    isPremium: false,
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Chocolate Lava Cake',
    category: 'desserts',
    price: 179,
    weight: '150g',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    images: [
      'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    ],
    description: 'Warm chocolate cake with a molten chocolate center',
    isPremium: true,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    addons: [
      { id: 'a5', name: 'Ice Cream Scoop', price: 40 },
    ],
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Cappuccino',
    category: 'beverages',
    price: 120,
    weight: '250ml',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    images: [
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    ],
    description: 'Espresso with steamed milk and foam',
    isPremium: false,
    isAvailable: true,
  },
  {
    id: '7',
    name: 'Paneer Tikka',
    category: 'starters',
    price: 249,
    weight: '300g',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    ],
    description: 'Marinated paneer cubes grilled to perfection',
    isPremium: false,
    addons: [
      { id: 'a6', name: 'Mint Chutney', price: 15 },
    ],
    isAvailable: true,
  },
];

// Export menu data as a single object
export const menuData = {
  categories: menuCategories,
  items: menuItems,
};
