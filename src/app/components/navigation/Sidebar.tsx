"use client";

import React, { useState, useEffect } from "react";
import { Box, List, Drawer, useMediaQuery, useTheme } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton } from "@mui/material";
import SidebarSection from "../SidebarSection";
import { SectionKey, DEFAULT_STATE, SIDEBAR_ITEMS } from "./SidebarConfig";

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
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Box
          component="img"
          src="/queuequell-logo.png"
          alt="QueueQuell Logo"
          sx={{ width: 50, height: "auto" }}
        />
      </Box>

      <List sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarSection
            key={item.key}
            title={item.title}
            icon={item.icon}
            href={item.href}
            subItems={item.subItems}
            open={open[item.key]}
            onToggle={() => toggle(item.key)}
            collapsed={collapsed}
          />
        ))}

        {/* Static sections without toggle */}
        <SidebarSection
          title="Analytics"
          icon={<AnalyticsIcon />}
          href="/analytics"
          subItems={[]}
          open={false}
          onToggle={() => {}}
          collapsed={collapsed}
        />

        <SidebarSection
          title="Notifications"
          icon={<NotificationsIcon />}
          href="/notifications"
          subItems={[]}
          open={false}
          onToggle={() => {}}
          collapsed={collapsed}
        />

        <SidebarSection
          title="Settings"
          icon={<SettingsIcon />}
          href="/settings"
          subItems={[]}
          open={false}
          onToggle={() => {}}
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
          onToggle={() => {}}
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
    </React.Fragment>
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
    </Box>
  );
}
