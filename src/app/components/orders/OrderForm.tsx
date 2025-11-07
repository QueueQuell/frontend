import React from "react";
import { Typography, Box, Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, IconButton } from "@mui/material";
import Link from "next/link";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DeleteIcon from "@mui/icons-material/Delete";

const menuItems = [
  { id: 1, name: "Margherita Pizza", price: 12.99 },
  { id: 2, name: "Caesar Salad", price: 8.99 },
  { id: 3, name: "Grilled Chicken", price: 15.99 },
];

export default function OrderForm() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Customer Name" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Order Type</InputLabel>
                <Select label="Order Type">
                  <MenuItem value="dine-in">Dine In</MenuItem>
                  <MenuItem value="takeout">Takeout</MenuItem>
                  <MenuItem value="delivery">Delivery</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Special Instructions" multiline rows={2} variant="outlined" />
            </Grid>
          </Grid>
        </Paper>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add Items
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <FormControl fullWidth>
                <InputLabel>Select Item</InputLabel>
                <Select label="Select Item">
                  {menuItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} - ₹{item.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button variant="contained" fullWidth>
                Add Item
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Order Items</Typography>
            <List>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary="Margherita Pizza" secondary="₹12.99" />
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography>Subtotal: ₹12.99</Typography>
            <Typography>Tax: ₹1.17</Typography>
            <Typography variant="h6">Total: ₹14.16</Typography>
          </Box>
          <Button variant="contained" fullWidth startIcon={<ReceiptIcon />}>
            Create Order
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
