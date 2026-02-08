"use client";

import React from "react";
import {
  Drawer,
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

interface UserMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Feature flags for phase management
const PHASE_1_ENABLED = process.env.NEXT_PUBLIC_PHASE_1_ENABLED === "true"; // Configurable via environment variable

export default function UserMenuDrawer({ open, onClose }: UserMenuDrawerProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = 320;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenType");
    onClose();
    router.push("/login");
  };

  const menuItems = [
    {
      icon: PersonIcon,
      text: "Profile",
      href: "/user/profile",
    },
    {
      icon: AssignmentIcon,
      text: "Address",
      href: "/user/address",
    },
    {
      icon: PaymentIcon,
      text: "Subscription",
      href: "/user/subscription",
    },
    ...(PHASE_1_ENABLED
      ? [
          {
            icon: SecurityIcon,
            text: "Security",
            href: "/security",
          },
        ]
      : []),
    ...(PHASE_1_ENABLED
      ? [
          {
            icon: SettingsIcon,
            text: "Account settings",
            href: "/account-settings",
          },
        ]
      : []),
  ];

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Profile Section */}
      <Box
        onClick={onClose}
        sx={{
          px: 3,
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "cyan.200",
          borderBottom: 0.5,
          borderColor: "divider",
          textDecoration: "none",
          "&:hover": {
            bgcolor: "grey.50",
          },
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            border: "1px solid",
            boxShadow: 5,
            borderColor: "success.main",
          }}
          src="/api/placeholder/80/80" // Placeholder; replace with real user avatar if available
        >
          JF
        </Avatar>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}
        >
          Jaydon Frankie
        </Typography>
        <Typography variant="body2" color="text.secondary">
          demo@minimals.cc
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Administrator
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, p: 0 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ px: 1 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={onClose}
              sx={{
                borderRadius: 0.5,
                mx: 1,
                my: 0.5,
                py: 1.5,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.primary" }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: {
                    fontWeight:
                      item.text === "Account settings" ? "normal" : "medium",
                  },
                }}
                sx={{ my: 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          fullWidth
          sx={{
            borderRadius: 0.5,
            textTransform: "none",
            py: 1.5,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      variant="temporary"
      open={open}
      onClose={onClose}
      elevation={5}
      ModalProps={{
        keepMounted: true,
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "5px 0 0 5px",
            boxShadow: 3,
          },
        },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          position: "fixed",
          top: 0,
          height: "100%",
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
