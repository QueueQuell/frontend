"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Box, 
  List, 
  Drawer, 
  useMediaQuery, 
  useTheme, 
  IconButton, 
  Tooltip,
  Popover,
  MenuItem,
  ListItemText,
  Divider,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import SidebarSection from "../SidebarSection";
import { SectionKey, DEFAULT_STATE, SIDEBAR_ITEMS } from "./SidebarConfig";

const PHASE_1_ENABLED = process.env.NEXT_PUBLIC_PHASE_1_ENABLED === 'true';
const STORAGE_KEY = "sidebar-state";

// Consolidated static menu items
const STATIC_ITEMS = [
  { title: "Analytics", icon: <AnalyticsIcon />, href: "/analytics", phase1Only: true },
  { title: "Notifications", icon: <NotificationsIcon />, href: "/notifications", phase1Only: true },
  { title: "Settings", icon: <SettingsIcon />, href: "/settings", phase1Only: true },
];

const HELP_ITEM = { title: "Help & Support", icon: <HelpIcon />, href: "/help" };

// Shared dimensions
const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 260;

const MOBILE_DRAWER_STYLES = {
  display: { xs: 'block', md: 'none' },
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: DRAWER_WIDTH,
    bgcolor: "background.paper",
    borderRight: 1,
    borderColor: "divider",
    boxShadow: 1,
    p: 2,
  },
};

const DESKTOP_SIDEBAR_STYLES = {
  backgroundColor: "#ffffff",
  borderRight: "1px solid #e6e6e6",
  boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
  transition: "width 0.3s ease",
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  left: 0,
  top: 0,
  p: 2,
  height: "100vh",
  zIndex: 1000,
  "&::-webkit-scrollbar": { width: 0, height: 0 },
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export default function Sidebar({ 
  mobileOpen = false, 
  onMobileClose, 
  collapsed = false, 
  onToggleCollapsed 
}: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState<Record<SectionKey, boolean>>(DEFAULT_STATE);
  
  // Popover state - using anchor element for hover
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [popoverContent, setPopoverContent] = useState<{
    title: string;
    href: string;
    items: { label: string; href: string }[];
  } | null>(null);
  
  // Timeout for closing popover with delay
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setOpen(parsed);
      }
    } catch (error) {
      console.warn("Failed to load sidebar state:", error);
    }
  }, []);

  // Debounced localStorage save
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(open));
      } catch (error) {
        console.warn("Failed to save sidebar state:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [open]);

  // Toggle section (only when expanded) - Accordion behavior
  const toggle = useCallback((key: SectionKey) => {
    if (!collapsed) {
      setOpen((prevState) => {
        const newState = { ...DEFAULT_STATE }; // Close all sections
        newState[key] = !prevState[key]; // Toggle the clicked one
        return newState;
      });
    }
  }, [collapsed]);

  // Handle popover open on hover
  const handlePopoverOpen = useCallback((
    event: React.MouseEvent<HTMLElement>,
    title: string,
    href: string,
    items: { label: string; href: string }[]
  ) => {
    if (collapsed && items.length > 0) {
      // Clear any pending close timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setPopoverAnchor(event.currentTarget);
      setPopoverContent({ title, href, items });
    }
  }, [collapsed]);

  // Handle popover close with delay
  const handlePopoverClose = useCallback(() => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Set a delay before closing to allow mouse movement to popover
    closeTimeoutRef.current = setTimeout(() => {
      setPopoverAnchor(null);
      setPopoverContent(null);
    }, 100); // 100ms delay
  }, []);

  // Handle popover enter (cancel closing)
  const handlePopoverEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Memoized static section component
  const StaticSection = useMemo(() => 
    ({ title, icon, href }: { title: string; icon: React.ReactNode; href: string }) => (
      <SidebarSection
        title={title}
        icon={icon}
        href={href}
        subItems={[]}
        open={false}
        onToggle={() => {}}
        collapsed={collapsed}
      />
    ), [collapsed]
  );

  const sidebarContent = useMemo(() => (
    <>
      {/* Logo - clickable */}
      <Box 
        component={Link}
        href="/home"
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          mb: 3,
          cursor: "pointer",
          transition: "opacity 0.2s",
          "&:hover": { opacity: 0.8 }
        }}
      >
        <Box
          component="img"
          src="/queuequell-logo.png"
          alt="QueueQuell Logo"
          sx={{ 
            width: collapsed ? 40 : 50, 
            height: "auto",
            transition: "width 0.3s ease"
          }}
        />
      </Box>

      <List 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 0.25, 
          flexGrow: 1 
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Dynamic sidebar items with expansion or popover */}
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarSection
            key={item.key}
            title={item.title}
            icon={item.icon}
            href={item.href}
            subItems={item.subItems}
            open={!collapsed && open[item.key]}
            onToggle={() => toggle(item.key)}
            collapsed={collapsed}
            onPopoverOpen={(event) => handlePopoverOpen(event, item.title, item.href, item.subItems)}
            onPopoverClose={handlePopoverClose}
          />
        ))}

        {/* Static items */}
        {STATIC_ITEMS.map((item) => 
          (!item.phase1Only || PHASE_1_ENABLED) && (
            <StaticSection key={item.title} {...item} />
          )
        )}
      </List>

      {/* Help & Support at bottom */}
      <Box sx={{ mt: "auto", pt: 2 }}>
        <StaticSection {...HELP_ITEM} />

        {/* Collapse Toggle Button - Desktop only */}
        {!isMobile && onToggleCollapsed && (
          <Tooltip 
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"} 
            placement="right"
          >
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <IconButton
                onClick={onToggleCollapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                sx={{
                  color: "#666",
                  transition: "all 0.2s",
                  "&:hover": {
                    color: "#333",
                    bgcolor: "rgba(0,0,0,0.04)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* Popover Menu for Collapsed State - Hover Based */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={() => {
          setPopoverAnchor(null);
          setPopoverContent(null);
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableRestoreFocus
        sx={{
          pointerEvents: 'none',
          ml: 1,
          '& .MuiPopover-paper': {
            pointerEvents: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: .5,
            minWidth: 200,
          },
        }}
        PaperProps={{
          onMouseEnter: handlePopoverEnter,
          onMouseLeave: handlePopoverClose,
        }}
      >
        {popoverContent && (
          <Box sx={{ py: 0.5 }}>
            {/* Popover Title - Clickable */}
            <MenuItem
              component={Link}
              href={popoverContent.href}
              onClick={handlePopoverClose}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: .5,
                mx: 0.5,
                mb: 0.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemText 
                primary={popoverContent.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              />
            </MenuItem>

            {/* Divider between title and sub-items */}
            <Divider sx={{ my: 0.5 }} />

            {/* Popover Menu Items */}
            {popoverContent.items.map((subItem) => (
              <MenuItem
                key={subItem.href}
                component={Link}
                href={subItem.href}
                onClick={handlePopoverClose}
                sx={{
                  borderRadius: .5,
                  mx: 0.5,
                  px: 2,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemText 
                  primary={subItem.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                />
              </MenuItem>
            ))}
          </Box>
        )}
      </Popover>
    </>
  ), [
    collapsed, 
    open, 
    toggle, 
    isMobile, 
    onToggleCollapsed, 
    StaticSection, 
    popoverAnchor, 
    popoverContent, 
    handlePopoverOpen, 
    handlePopoverClose,
    handlePopoverEnter,
  ]);

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ 
          keepMounted: true,
          'aria-labelledby': 'mobile-navigation-drawer'
        }}
        sx={MOBILE_DRAWER_STYLES}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Main navigation"
      sx={{
        ...DESKTOP_SIDEBAR_STYLES,
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      }}
    >
      {sidebarContent}
    </Box>
  );
}