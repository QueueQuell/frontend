import { create } from "zustand";

// Types for menu items
export interface Variant {
  id: string;
  name: string;
  priceModifier: number;
  isDefault: boolean;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId?: string;
  categoryName?: string;
  category?:
    | string
    | {
        id: string;
        name: string;
      };
  image: string;
  images?: Array<{
    url: string;
    type: "primary" | "gallery" | "thumbnail" | "secondary";
  }>;
  isAvailable?: boolean;
  preparationTime?: number;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  variants?: Variant[];
  addOns?: Addon[];
  createdAt?: string;
  updatedAt?: string;
  weight?: string;
  isVeg?: boolean;
  isPremium?: boolean;
  videoUrl?: string;
  addons?: Addon[];
}

export interface CartItem extends MenuItemType {
  quantity: number;
  selectedAddons?: Addon[];
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (
    item: MenuItemType,
    quantity?: number,
    addons?: Addon[],
    instructions?: string,
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemAddons: (itemId: string, addons: Addon[]) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item, quantity = 1, addons = [], instructions = "") => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) =>
          i.id === item.id &&
          JSON.stringify(i.selectedAddons) === JSON.stringify(addons),
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { items: newItems };
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            quantity,
            selectedAddons: addons,
            specialInstructions: instructions,
          },
        ],
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    }));
  },

  updateItemAddons: (itemId, addons) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, selectedAddons: addons } : item,
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setCartOpen: (open) => {
    set({ isOpen: open });
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => {
      const addonsPrice =
        item.selectedAddons?.reduce((a, addon) => a + addon.price, 0) || 0;
      return sum + (item.price + addonsPrice) * item.quantity;
    }, 0);
  },
}));

// Filter state
interface FilterState {
  isVegOnly: boolean;
  isNonVegOnly: boolean;
  searchQuery: string;
  selectedCategory: string;

  // Actions
  setVegFilter: (veg: boolean) => void;
  setNonVegFilter: (nonVeg: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isVegOnly: false,
  isNonVegOnly: false,
  searchQuery: "",
  selectedCategory: "all",

  setVegFilter: (veg) => set({ isVegOnly: veg, isNonVegOnly: false }),
  setNonVegFilter: (nonVeg) => set({ isNonVegOnly: nonVeg, isVegOnly: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  clearFilters: () =>
    set({
      isVegOnly: false,
      isNonVegOnly: false,
      searchQuery: "",
      selectedCategory: "all",
    }),
}));
