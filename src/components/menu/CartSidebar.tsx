"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
  Slide,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  Close,
  ShoppingCartCheckout,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, CartItem } from "@/lib/store/cartStore";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartSidebar({
  open,
  onClose,
  onCheckout,
}: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();
  const tax = totalPrice * 0.1; // 10% tax
  const finalTotal = totalPrice + tax;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 400 },
            maxWidth: "100vw",
            borderRadius: { xs: 0, sm: "4px 0 0 4px" },
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingCartCheckout sx={{ color: "#8B0000" }} />

          <Typography variant="h6" sx={{ fontWeight: 600, color: "#111111" }}>
            Your Cart
          </Typography>
          <Typography variant="body2" sx={{ color: "#666666" }}>
            ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Cart Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
        }}
      >
        {items.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            <ShoppingCartCheckout
              sx={{ fontSize: 64, color: "#9CA3AF", mb: 2 }}
            />
            <Typography variant="h6" sx={{ color: "#666666" }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" sx={{ color: "#666666" }}>
              Add some delicious items to get started!
            </Typography>
          </Box>
        ) : (
          <AnimatePresence>
            {items.map((item) => (
              <CartItemCard
                key={`${item.id}-${JSON.stringify(item.selectedAddons)}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </AnimatePresence>
        )}
      </Box>

      {/* Footer with Total */}
      {items.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" sx={{ color: "#666666" }}>
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ color: "#111111" }}>
                ₹{totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" sx={{ color: "#666666" }}>
                Tax (10%)
              </Typography>
              <Typography variant="body2" sx={{ color: "#111111" }}>
                ₹{tax.toFixed(2)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#111111" }}
              >
                Total
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#8B0000", fontWeight: 700 }}
              >
                ₹{finalTotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={onCheckout}
            sx={{
              py: 1.5,
              borderRadius: 1,
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#FFFFFF",
              border: "2px solid #8B0000",
              color: "#111111",
              "&:hover": {
                backgroundColor: "#FFF5F5",
                borderColor: "#8B0000",
                color: "#111111",
              },
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      )}
    </Drawer>
  );
}

// Cart Item Card Component
interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const addonsPrice =
    item.selectedAddons?.reduce((sum, a) => sum + a.price, 0) || 0;
  const itemTotal = (item.price + addonsPrice) * item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 2,
          mb: 2,
          borderRadius: 1,
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
        }}
      >
        <Avatar
          src={item.image}
          variant="rounded"
          sx={{ width: 70, height: 70 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, lineHeight: 1.2, color: "#111111" }}
            >
              {item.name}
            </Typography>
            <IconButton size="small" onClick={() => onRemove(item.id)}>
              <Delete fontSize="small" sx={{ color: "#EF4444" }} />
            </IconButton>
          </Box>

          {/* Selected Addons */}
          {item.selectedAddons && item.selectedAddons.length > 0 && (
            <Typography
              variant="caption"
              sx={{ color: "#666666", display: "block" }}
            >
              + {item.selectedAddons.map((a) => a.name).join(", ")}
            </Typography>
          )}

          {/* Special Instructions */}
          {item.specialInstructions && (
            <Typography
              variant="caption"
              sx={{ color: "#666666", display: "block", fontStyle: "italic" }}
            >
              Note: {item.specialInstructions}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid #E5E7EB",
                borderRadius: 0,
              }}
            >
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                sx={{ borderRadius: 0 }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ minWidth: 20, textAlign: "center", color: "#111111" }}
              >
                {item.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                sx={{ borderRadius: 0 }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>

            <Typography
              variant="subtitle2"
              sx={{ color: "#8B0000", fontWeight: 600 }}
            >
              ₹{itemTotal.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
