"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic (e.g., clear tokens, redirect to login)
    handleClose();
    router.push("/login");
  };
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#ffffff",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 3.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          <IconButton
            color="inherit"
            onClick={handleClick}
            sx={{ color: "text.primary" }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => { handleClose(); router.push("/users/profile"); }}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}
