import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Button, TextField, Divider } from "@mui/material";

interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  onPlaceOrder: () => void;
}

export default function CheckoutDialog({
  open,
  onClose,
  cart,
  totalPrice,
  onPlaceOrder,
}: CheckoutDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        {cart.map((item) => (
          <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>
              {item.name} x {item.quantity}
            </Typography>
            <Typography>₹{(item.price * item.quantity).toFixed(2)}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">
            ₹{totalPrice.toFixed(2)}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Customer Name"
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Phone Number"
          margin="normal"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onPlaceOrder}>
          Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}
