"use client";

import React, { useState, useEffect } from "react";
import { Box, List, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import SidebarSection from "./SidebarSection";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton } from "@mui/material";

type SectionKey =
  | "home"
  | "inventory"
  | "orders"
  | "users"
  | "payments"
  | "items"
  | "suppliers"
  | "customers"
  | "qr";

const DEFAULT_STATE: Record<SectionKey, boolean> = {
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

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose, collapsed = false, onToggleCollapsed }: SidebarProps) {
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
    <React.Fragment>
      {/* Logo */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3, mt: 1 }}>
        <Box
          component="img"
          src="/queuequell-logo.png"
          alt="QueueQuell Logo"
          sx={{ width: 50, height: "auto" }}
        />
      </Box>

      <List sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>

        <SidebarSection
          title="Dashboard"
          icon={<HomeIcon />}
          href="/home"
          subItems={[]}
          open={open.home}
          onToggle={() => toggle("home")}
          collapsed={collapsed}
        />
        
        <SidebarSection
          title="Menu"
          icon={<RestaurantMenuIcon />}
          href="/items"
          subItems={[
            { label: "Catalog", href: "/items/catalog" },
            { label: "Categories", href: "/items/categories" },
          ]}
          open={open.items}
          onToggle={() => toggle("items")}
          collapsed={collapsed}
        />

        <SidebarSection
          title="Order"
          icon={<ShoppingCartIcon />}
          href="/orders"
          subItems={[
            { label: "List Orders", href: "/orders/list" },
            { label: "Create Order", href: "/orders/create" },
          ]}
          open={open.orders}
          onToggle={() => toggle("orders")}
          collapsed={collapsed}
        />



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
          collapsed={collapsed}
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
          collapsed={collapsed}
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
          collapsed={collapsed}
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
          collapsed={collapsed}
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
          collapsed={collapsed}
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
          collapsed={collapsed}
        />

        <SidebarSection
          title="Analytics"
          icon={<AnalyticsIcon />}
          href="/analytics"
          subItems={[]}
          open={false}
          onToggle={() => { }}
          collapsed={collapsed}
        />

        <SidebarSection
          title="Notifications"
          icon={<NotificationsIcon />}
          href="/notifications"
          subItems={[]}
          open={false}
          onToggle={() => { }}
          collapsed={collapsed}
        />

        <SidebarSection
          title="Settings"
          icon={<SettingsIcon />}
          href="/settings"
          subItems={[]}
          open={false}
          onToggle={() => { }}
          collapsed={collapsed}
        />
      </List>

      {/* Help & Support at bottom */}
      <Box sx={{ mt: "auto", pt: 2 }}>
        <SidebarSection
          title="Help & Support"
          icon={<HelpIcon />}
          href="/help"
          subItems={[]}
          open={false}
          onToggle={() => { }}
          collapsed={collapsed}
        />

        {/* Collapse Toggle Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <IconButton
            onClick={onToggleCollapsed}
            sx={{
              color: "#666",
              "&:hover": {
                color: "#333",
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      </Box>
    </ React.Fragment>
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
    <Box
      sx={{
        width: collapsed ? 80 : 260,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e6e6e6",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        transition: "width 0.3s ease",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        p: 2,
        height: "100vh",
        zIndex: 1000,
      }}
    >
      {sidebarContent}
    </ Box>
  );
}
