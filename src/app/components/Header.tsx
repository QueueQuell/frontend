"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme as useCustomTheme } from "./MuiProviders";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { toggleTheme, isDark } = useCustomTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        QueueQuell
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/inventory">
            <ListItemText primary="Inventory" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/orders">
            <ListItemText primary="Orders" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/items">
            <ListItemText primary="Items" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/customers">
            <ListItemText primary="Customers" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 3.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick || handleDrawerToggle}
              sx={{ mr: 2, color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              component={Link}
              href="/home"
              sx={{
                fontWeight: 700,
                textDecoration: "none",
                color: "text.primary",
                "&:hover": { textDecoration: "none" },
              }}
            >
              QueueQuell
            </Typography>

          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{
                mr: 1,
                color: "text.primary",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button
              id="account-button"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              startIcon={<AccountCircle />}
              sx={{
                color: "text.primary",
                textTransform: "none",
                fontSize: "15px",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Account
            </Button>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "account-button",
              }}
              PaperProps={{
                sx: {
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  boxShadow: 1,
                  "& .MuiMenuItem-root": {
                    color: "text.primary",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={handleClose} component={Link} href="/users/profile">
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose} component={Link} href="/users/address">
                Address
              </MenuItem>
              <MenuItem
                onClick={() => {
                  // Clear session/localStorage
                  localStorage.clear();
                  sessionStorage.clear();
                  handleClose();
                  // Redirect to login
                  window.location.href = "/login";
                }}
              >
                Signout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
