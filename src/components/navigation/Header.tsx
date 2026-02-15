"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import UserMenuDrawer from "./UserMenuDrawer";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenType");
    handleDrawerClose();
    router.push("/login");
  };
  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#ffffff",
          color: "text.primary",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: 3.5,
            justifyItems: "right",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}></Box>
          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <AccountCircle sx={{ fontSize: 32, color: "text.secondary" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <UserMenuDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
}
