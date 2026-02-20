import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import QrCodeIcon from "@mui/icons-material/QrCode";

const PHASE_1_ENABLED = process.env.NEXT_PUBLIC_PHASE_1_ENABLED === "true";

export type SectionKey =
  | "home"
  | "inventory"
  | "orders"
  | "payments"
  | "items"
  | "suppliers"
  | "customers"
  | "qr";

export const DEFAULT_STATE: Record<SectionKey, boolean> = {
  home: false,
  inventory: false,
  orders: false,
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
  phase1Only?: boolean; // NEW: Mark phase-gated items
}

// Helper to create subitems more concisely
const createSubItems = (basePath: string, items: [string, string][]) =>
  items.map(([label, path]) => ({ label, href: `${basePath}${path}` }));

// All sidebar items (including phase-gated ones)
const ALL_SIDEBAR_ITEMS: SidebarItem[] = [
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
    subItems: createSubItems("/items", [
      ["Catalog", "/catalog"],
      ["Create Item", "/catalog/create"],
      ["Sections", "/sections"],
      ["Create Section", "/sections/create"],
    ]),
  },
  {
    key: "orders",
    title: "Order",
    icon: <ShoppingCartIcon />,
    href: "/orders",
    subItems: createSubItems("/orders", [
      ["List Orders", "/list"],
      ["Create Order", "/create"],
    ]),
  },
  {
    key: "inventory",
    title: "Inventory",
    icon: <InventoryIcon />,
    href: "/inventory",
    subItems: createSubItems("/inventory", [
      ["List Inventory", "/list"],
      ["Add Inventory", "/add"],
      ["Stock Adjustment", "/adjust"],
    ]),
    phase1Only: true,
  },
  {
    key: "payments",
    title: "Payments",
    icon: <PaymentIcon />,
    href: "/payments",
    subItems: createSubItems("/payments", [
      ["Payment History", "/history"],
      ["Payment Methods", "/methods"],
    ]),
    phase1Only: true,
  },
  {
    key: "suppliers",
    title: "Suppliers",
    icon: <LocalShippingIcon />,
    href: "/suppliers",
    subItems: createSubItems("/suppliers", [
      ["List Suppliers", "/list"],
      ["Add Supplier", "/add"],
      ["Performance", "/performance"],
    ]),
    phase1Only: true,
  },
  {
    key: "customers",
    title: "Customers",
    icon: <GroupIcon />,
    href: "/customers",
    subItems: createSubItems("/customers", [
      ["List Customers", "/list"],
      ["Loyalty", "/loyalty"],
      ["Add Customer", "/add"],
    ]),
    phase1Only: true,
  },
  {
    key: "qr",
    title: "QR Management",
    icon: <QrCodeIcon />,
    href: "/qr",
    subItems: createSubItems("/qr", [
      ["Generate QR", "/generate"],
      ["List All QR Codes", "/list"],
      ["Tables", "/tables"],
      ["Menus", "/menus"],
    ]),
  },
];

// Filter items based on phase flag
export const SIDEBAR_ITEMS: SidebarItem[] = ALL_SIDEBAR_ITEMS.filter(
  (item) => !item.phase1Only || PHASE_1_ENABLED,
);
