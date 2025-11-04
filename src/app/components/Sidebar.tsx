"use client";

import React, { useState, useEffect } from "react";
import { Box, List, Drawer, useMediaQuery, useTheme } from "@mui/material";
import SidebarSection from "./SidebarSection";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import QrCodeIcon from "@mui/icons-material/QrCode";

type SectionKey =
  | "inventory"
  | "orders"
  | "users"
  | "payments"
  | "items"
  | "suppliers"
  | "customers"
  | "qr";

const DEFAULT_STATE: Record<SectionKey, boolean> = {
  inventory: false,
  orders: false,
  users: false,
  payments: false,
  items: false,
  suppliers: false,
  customers: false,
  qr: false,
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState<Record<SectionKey, boolean>>(DEFAULT_STATE);

  useEffect(() => {
    // try to restore state from localStorage so expand/collapse persists per user
    try {
      const raw = localStorage.getItem("sidebar-open");
      if (raw) setOpen(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-open", JSON.stringify(open));
    } catch {
      // ignore
    }
  }, [open]);

  const toggle = (key: SectionKey) =>
    setOpen((s) => {
      const newState = { ...DEFAULT_STATE };
      newState[key] = !s[key];
      return newState;
    });

  const sidebarContent = (
    <Box
      sx={{
        width: 280,
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        minHeight: "100vh",
        p: 2,
        boxSizing: "border-box",
        boxShadow: 1,
      }}
    >
      <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <SidebarSection
          title="Inventory"
          icon={<InventoryIcon />}
          href="/inventory"
          subItems={[
            { label: "List Inventory", href: "/inventory/list" },
            { label: "Add Inventory", href: "/inventory/add" },
            { label: "Stock Adjustment", href: "/inventory/adjust" },
          ]}
          open={open.inventory}
          onToggle={() => toggle("inventory")}
        />

        <SidebarSection
          title="Orders"
          icon={<ShoppingCartIcon />}
          href="/orders"
          subItems={[
            { label: "List Orders", href: "/orders/list" },
            { label: "Create Order", href: "/orders/create" },
          ]}
          open={open.orders}
          onToggle={() => toggle("orders")}
        />

        <SidebarSection
          title="Users"
          icon={<PeopleIcon />}
          href="/users"
          subItems={[
            { label: "Profile", href: "/users/profile" },
            { label: "Address", href: "/users/address" },
          ]}
          open={open.users}
          onToggle={() => toggle("users")}
        />

        <SidebarSection
          title="Payments"
          icon={<PaymentIcon />}
          href="/payments"
          subItems={[
            { label: "Payment History", href: "/payments/history" },
            { label: "Payment Methods", href: "/payments/methods" },
          ]}
          open={open.payments}
          onToggle={() => toggle("payments")}
        />

        <SidebarSection
          title="Items"
          icon={<RestaurantMenuIcon />}
          href="/items"
          subItems={[
            { label: "Catalog", href: "/items/catalog" },
            { label: "Add Item", href: "/items/add" },
          ]}
          open={open.items}
          onToggle={() => toggle("items")}
        />

        <SidebarSection
          title="Suppliers"
          icon={<LocalShippingIcon />}
          href="/suppliers"
          subItems={[
            { label: "List Suppliers", href: "/suppliers/list" },
            { label: "Add Supplier", href: "/suppliers/add" },
            { label: "Performance", href: "/suppliers/performance" },
          ]}
          open={open.suppliers}
          onToggle={() => toggle("suppliers")}
        />

        <SidebarSection
          title="Customers"
          icon={<GroupIcon />}
          href="/customers"
          subItems={[
            { label: "List Customers", href: "/customers/list" },
            { label: "Loyalty", href: "/customers/loyalty" },
            { label: "Add Customer", href: "/customers/add" },
          ]}
          open={open.customers}
          onToggle={() => toggle("customers")}
        />

        <SidebarSection
          title="QR Management"
          icon={<QrCodeIcon />}
          href="/qr"
          subItems={[
            { label: "Generate QR", href: "/qr/generate" },
            { label: "Tables", href: "/qr/tables" },
            { label: "Menus", href: "/qr/menus" },
          ]}
          open={open.qr}
          onToggle={() => toggle("qr")}
        />
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            bgcolor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
            boxShadow: 1,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          boxShadow: 1,
        },
      }}
      open
    >
      {sidebarContent}
    </Drawer>
  );
}
