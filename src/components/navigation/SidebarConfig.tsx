import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BusinessIcon from "@mui/icons-material/Business";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import {
  isAdminRole,
  isSuperAdmin,
  ADMIN_ROLES,
} from "@/lib/utils/accessControl";

const PHASE_1_ENABLED = process.env.NEXT_PUBLIC_PHASE_1_ENABLED === "true";

export type SectionKey =
  | "home"
  | "inventory"
  | "orders"
  | "payments"
  | "items"
  | "suppliers"
  | "customers"
  | "qr"
  | "administrator";

export const DEFAULT_STATE: Record<SectionKey, boolean> = {
  home: false,
  inventory: false,
  orders: false,
  payments: false,
  items: false,
  suppliers: false,
  customers: false,
  qr: false,
  administrator: false,
};

export interface SidebarItem {
  key: SectionKey;
  title: string;
  icon: React.ReactNode;
  href: string;
  subItems: { label: string; href: string }[];
  phase1Only?: boolean; // NEW: Mark phase-gated items
  adminOnly?: boolean; // NEW: Mark admin-only items
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
    href: "/catalog",
    subItems: createSubItems("/catalog", [
      ["Items", "/items/list"],
      ["Create Item", "/items/create"],
      ["Categories", "/categories/list"],
      ["Create Category", "/categories/create"],
    ]),
  },
  {
    key: "orders",
    title: "Order",
    icon: <ShoppingCartIcon />,
    href: "/orders",
    subItems: createSubItems("/orders", [
      ["Orders", "/list"],
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
      ["Suppliers", "/list"],
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
      ["Customers", "/list"],
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
      ["QR Codes", "/list"],
      ["Generate QR", "/generate"],
      // Tables and Menus disabled temporarily
      // ["Tables", "/tables"],
      // ["Menus", "/menus"],
    ]),
  },
  {
    key: "administrator",
    title: "Administrator",
    icon: <AdminPanelSettingsIcon />,
    href: "/administrator",
    subItems: createSubItems("/administrator", [
      ["Organisations", "/organisations/list"],
      ["Users", "/users/list"],
    ]),
    adminOnly: true,
  },
];

// Filter items based on phase flag and admin role
export const SIDEBAR_ITEMS: SidebarItem[] = ALL_SIDEBAR_ITEMS.filter(
  (item) => !item.phase1Only || PHASE_1_ENABLED,
);

// Helper function to check if user has admin access
// Includes: SuperAdmin (SaaS), ADMIN, OWNER (organisation-level)
export const hasAdminAccess = (role: string | undefined): boolean => {
  if (!role) return false;
  // SuperAdmin has full access
  if (isSuperAdmin(role)) return true;
  // ADMIN and OWNER have organisation-level admin access
  return isAdminRole(role);
};
