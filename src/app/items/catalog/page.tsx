"use client";
import CommonLayout from "../../components/CommonLayout";
import { Typography, Box, Grid, Card, CardContent, CardMedia, CardActions, Button, Chip } from "@mui/material";
import Link from "next/link";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddIcon from "@mui/icons-material/Add";

const menuItems = [
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 12.99, image: "/api/placeholder/300/200", available: true },
  { id: 2, name: "Caesar Salad", category: "Salads", price: 8.99, image: "/api/placeholder/300/200", available: true },
  { id: 3, name: "Grilled Chicken", category: "Main Course", price: 15.99, image: "/api/placeholder/300/200", available: false },
  { id: 4, name: "Chocolate Cake", category: "Desserts", price: 6.99, image: "/api/placeholder/300/200", available: true },
];

export default function MenuCatalogPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Menu Catalog
          </Typography>
          <Button component={Link} href="/items/add" variant="contained" startIcon={<AddIcon />}>
            Add Item
          </Button>
        </Box>
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.category}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${item.price}
                  </Typography>
                  <Chip
                    label={item.available ? "Available" : "Unavailable"}
                    color={item.available ? "success" : "error"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/items" variant="outlined">
            ← Back to Items
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
