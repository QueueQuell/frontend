"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Box, Button, Menu, MenuItem, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme as useCustomTheme } from "./MuiProviders";

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { toggleTheme, isDark } = useCustomTheme();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
  );
}
