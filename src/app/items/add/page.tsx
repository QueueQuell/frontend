"use client";
import CommonLayout from "../../components/CommonLayout";
import { Typography, Box, Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Link from "next/link";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

export default function AddItemPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add New Menu Item
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Item Name" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="pizza">Pizza</MenuItem>
                  <MenuItem value="salads">Salads</MenuItem>
                  <MenuItem value="main">Main Course</MenuItem>
                  <MenuItem value="desserts">Desserts</MenuItem>
                  <MenuItem value="beverages">Beverages</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Price" type="number" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Image URL" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select label="Availability">
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="unavailable">Unavailable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Preparation Time (minutes)" type="number" variant="outlined" />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" startIcon={<RestaurantMenuIcon />}>
              Add Item
            </Button>
            <Button component={Link} href="/items/catalog" variant="outlined">
              Cancel
            </Button>
          </Box>
        </Paper>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/items" variant="outlined">
            ← Back to Items
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
