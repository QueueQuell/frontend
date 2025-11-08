import React from "react";
import { Box, Typography, Stack, Avatar, IconButton, Button } from "@mui/material";
import { Add, Remove, Whatshot } from "@mui/icons-material";

interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartDrawerProps {
  cart: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveFromCart: (itemId: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  cart,
  totalPrice,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
}: CartDrawerProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        overflowX: "auto",
        maxHeight: 120,
      }}
    >
      <Typography variant="h6" sx={{ minWidth: "fit-content" }}>
        Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):
      </Typography>
      <Stack direction="row" spacing={2} sx={{ flex: 1, overflowX: "auto" }}>
        {cart.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 200,
              p: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Avatar 
              src={item.image} 
              sx={{ width: 40, height: 40 }}
              slotProps={{ img: { loading: "lazy" } }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ₹{item.price} x {item.quantity}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton size="small" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                <Remove fontSize="small" />
              </IconButton>
              <Typography variant="body2">{item.quantity}</Typography>
              <IconButton size="small" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                <Add fontSize="small" />
              </IconButton>
            </Box>
            <IconButton size="small" onClick={() => onRemoveFromCart(item.id)}>
              <Whatshot color="error" fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: "fit-content" }}>
        <Typography variant="h6" color="primary">
          Total: ₹{totalPrice.toFixed(2)}
        </Typography>
        <Button variant="contained" onClick={onCheckout}>
          Checkout
        </Button>
      </Box>
    </Box>
  );
}
