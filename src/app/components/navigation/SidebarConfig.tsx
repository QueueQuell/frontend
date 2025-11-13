import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import QrCodeIcon from "@mui/icons-material/QrCode";

export type SectionKey =
  | "home"
  | "inventory"
  | "orders"
  | "users"
  | "payments"
  | "items"
  | "suppliers"
  | "customers"
  | "qr";

export const DEFAULT_STATE: Record<SectionKey, boolean> = {
  home: false,
  inventory: false,
  orders: false,
  users: false,
  payments: false,
  items: false,
  suppliers: false,
  customers: false,
  qr: false,
};

export interface SidebarItem {
  key: SectionKey;
  title: string;
  icon: React.ReactNode;
  href: string;
  subItems: { label: string; href: string }[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    key: "home",
    title: "Dashboard",
    icon: <HomeIcon />,
    href: "/home",
    subItems: [],
  },
  {
    key: "items",
    title: "Menu",
    icon: <RestaurantMenuIcon />,
    href: "/items",
    subItems: [
      { label: "Catalog", href: "/items/catalog" },
      { label: "Create Item", href: "/items/catalog/create" },
      { label: "Sections", href: "/items/sections" },
      { label: "Create Section", href: "/items/sections/create" },
    ],
  },
  {
    key: "orders",
    title: "Order",
    icon: <ShoppingCartIcon />,
    href: "/orders",
    subItems: [
      { label: "List Orders", href: "/orders/list" },
      { label: "Create Order", href: "/orders/create" },
    ],
  },
  {
    key: "inventory",
    title: "Inventory",
    icon: <InventoryIcon />,
    href: "/inventory",
    subItems: [
      { label: "List Inventory", href: "/inventory/list" },
      { label: "Add Inventory", href: "/inventory/add" },
      { label: "Stock Adjustment", href: "/inventory/adjust" },
    ],
  },
  {
    key: "users",
    title: "Users",
    icon: <PeopleIcon />,
    href: "/users",
    subItems: [
      { label: "Profile", href: "/users/profile" },
      { label: "Address", href: "/users/address" },
      { label: "Subscription", href: "/user/manage/subscription" },
    ],
  },
  {
    key: "payments",
    title: "Payments",
    icon: <PaymentIcon />,
    href: "/payments",
    subItems: [
      { label: "Payment History", href: "/payments/history" },
      { label: "Payment Methods", href: "/payments/methods" },
    ],
  },
  {
    key: "suppliers",
    title: "Suppliers",
    icon: <LocalShippingIcon />,
    href: "/suppliers",
    subItems: [
      { label: "List Suppliers", href: "/suppliers/list" },
      { label: "Add Supplier", href: "/suppliers/add" },
      { label: "Performance", href: "/suppliers/performance" },
    ],
  },
  {
    key: "customers",
    title: "Customers",
    icon: <GroupIcon />,
    href: "/customers",
    subItems: [
      { label: "List Customers", href: "/customers/list" },
      { label: "Loyalty", href: "/customers/loyalty" },
      { label: "Add Customer", href: "/customers/add" },
    ],
  },
  {
    key: "qr",
    title: "QR Management",
    icon: <QrCodeIcon />,
    href: "/qr",
    subItems: [
      { label: "Generate QR", href: "/qr/generate" },
      { label: "Tables", href: "/qr/tables" },
      { label: "Menus", href: "/qr/menus" },
    ],
  },
];
