import React from "react";
import { Box, Typography, IconButton, TextField, AppBar, Toolbar } from "@mui/material";
import { ShoppingCart, Search, Menu } from "@mui/icons-material";
import { Badge } from "@mui/material";

interface MenuHeaderProps {
  totalItems: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  onMenuClick: () => void;
  isSmallScreen: boolean;
}

export default function MenuHeader({
  totalItems,
  searchQuery,
  onSearchChange,
  onCartClick,
  onMenuClick,
  isSmallScreen,
}: MenuHeaderProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        {isSmallScreen && (
          <IconButton color="inherit" onClick={onMenuClick} sx={{ mr: 1 }}>
            <Menu />
          </IconButton>
        )}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box
            component="img"
            src="https://www.haldirams.com/media/logo/stores/1/Delhi_Haldiram_Logo_1_.png"
            alt="Restaurant Logo"
            sx={{ height: 40, mr: 2 }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            QueueQuell
          </Typography>
        </Box>
        <IconButton color="inherit" onClick={onCartClick}>
          <Badge badgeContent={totalItems} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
