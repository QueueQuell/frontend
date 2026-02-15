"use client";
import Link from "next/link";
import { Typography, Box, TextField, Button, Paper, Grid, MenuItem } from "@mui/material";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function InventoryAddPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Inventory", href: "/inventory" },
          { label: "Add" },
        ]}
      />
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Item Name"
              placeholder="e.g., Margherita Pizza"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="SKU"
              placeholder="e.g., SKU-12345"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label="Category"
              defaultValue=""
              required
            >
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Beverage">Beverage</MenuItem>
              <MenuItem value="Sides">Sides</MenuItem>
              <MenuItem value="Dessert">Dessert</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label="Unit"
              defaultValue=""
              required
            >
              <MenuItem value="pcs">Pieces</MenuItem>
              <MenuItem value="kg">Kilograms</MenuItem>
              <MenuItem value="ltr">Liters</MenuItem>
              <MenuItem value="box">Boxes</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Unit Cost"
              type="number"
              placeholder="0.00"
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              select
              label="Location"
              defaultValue=""
              required
            >
              <MenuItem value="Main Kitchen">Main Kitchen</MenuItem>
              <MenuItem value="Cold Room">Cold Room</MenuItem>
              <MenuItem value="Pantry">Pantry</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button variant="contained" color="primary" size="large">
              Add Item
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Button component={Link} href="/inventory" variant="outlined">
          ← Back to Inventory
        </Button>
      </Box>
    </Box>
  );
}
