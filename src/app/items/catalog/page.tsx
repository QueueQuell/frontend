"use client";
import CommonLayout from "../../components/CommonLayout";
import { Typography, Box, Grid, Card, CardContent, CardMedia, CardActions, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import Link from "next/link";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

const menuItems = [
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 12.99, image: "/api/placeholder/300/200", available: true },
  { id: 2, name: "Caesar Salad", category: "Salads", price: 8.99, image: "/api/placeholder/300/200", available: true },
  { id: 3, name: "Grilled Chicken", category: "Main Course", price: 15.99, image: "/api/placeholder/300/200", available: false },
  { id: 4, name: "Chocolate Cake", category: "Desserts", price: 6.99, image: "/api/placeholder/300/200", available: true },
];

export default function MenuCatalogPage() {
  const [addDialog, setAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    imageUrl: "",
    description: "",
    availability: "available",
    preparationTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setError("Item name is required");
      return;
    }
    if (!formData.category) {
      setError("Category is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await api.createItem(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setFormData({
        name: "",
        category: "",
        price: "",
        imageUrl: "",
        description: "",
        availability: "available",
        preparationTime: "",
      });
      setAddDialog(false);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Failed to create item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Menu Catalog
          </Typography>
          <Button onClick={() => setAddDialog(true)} variant="contained" startIcon={<AddIcon />}>
            Add Item
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Item added successfully!
          </Alert>
        )}
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
                    ₹{item.price}
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
        {/* Add Item Dialog */}
        <Dialog
          open={addDialog}
          onClose={() => setAddDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Item Name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g., Margherita Pizza"
                      helperText="Enter a descriptive name for the menu item"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                        label="Category"
                        value={formData.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                      >
                        <MenuItem value="pizza">Pizza</MenuItem>
                        <MenuItem value="salads">Salads</MenuItem>
                        <MenuItem value="main">Main Course</MenuItem>
                        <MenuItem value="desserts">Desserts</MenuItem>
                        <MenuItem value="beverages">Beverages</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      placeholder="0.00"
                      helperText="Enter the price in rupees"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Image URL"
                      value={formData.imageUrl}
                      onChange={(e) => handleChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      helperText="Optional: URL of the item image"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Optional description of the menu item"
                      helperText="Provide additional details about ingredients or preparation"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Availability</InputLabel>
                      <Select
                        label="Availability"
                        value={formData.availability}
                        onChange={(e) => handleChange("availability", e.target.value)}
                      >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="unavailable">Unavailable</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Preparation Time (minutes)"
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => handleChange("preparationTime", e.target.value)}
                      placeholder="15"
                      helperText="Optional: Time needed to prepare this item"
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting}
              startIcon={<RestaurantMenuIcon />}
            >
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/items" variant="outlined">
            ← Back to Items
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
