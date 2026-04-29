import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import { Grass, Search, Whatshot } from "@mui/icons-material";
import { TextField } from "@mui/material";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  weight: string;
  isVeg: boolean;
  image: string;
  description: string;
}

interface MenuItemsProps {
  items: MenuItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (item: MenuItem) => void;
  isSmallScreen: boolean;
}

export default function MenuItems({
  items,
  searchQuery,
  onSearchChange,
  onAddToCart,
  isSmallScreen,
}: MenuItemsProps) {
  return (
    <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          {items.length > 0 ? items[0].category : "Menu"}
        </Typography>
        <TextField
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
            },
          }}
          sx={{ width: isSmallScreen ? 200 : 300 }}
          size="small"
        />
      </Box>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid size={{ xs: 12 }} key={item.id}>
            <Card sx={{ height: "100%", display: "flex" }}>
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                loading="lazy"
                sx={{ width: 140, height: 140, objectFit: "cover" }}
              />
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {item.name}
                  </Typography>
                  <IconButton size="small">
                    {item.isVeg ? (
                      <Grass color="success" />
                    ) : (
                      <Whatshot color="error" />
                    )}
                  </IconButton>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {item.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip label={`${item.weight}`} size="small" />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" color="primary">
                      ₹{item.price}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
