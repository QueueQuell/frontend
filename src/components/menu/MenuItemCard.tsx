"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slide,
  Stack,
} from "@mui/material";
import {
  Grass,
  Whatshot,
  Add,
  Remove,
  LocalFireDepartment,
  ChevronLeft,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { MenuItemType, Addon, useCartStore } from "@/lib/store/cartStore";

interface MenuItemCardProps {
  item: MenuItemType;
  onViewDetails?: (item: MenuItemType) => void;
}

export default function MenuItemCard({
  item,
  onViewDetails,
}: MenuItemCardProps) {
  const [showAddons, setShowAddons] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [instructions, setInstructions] = useState("");

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const isVegetarian = item.isVegetarian ?? item.isVeg ?? false;
  const isVegan = item.isVegan ?? false;
  const isGlutenFree = item.isGlutenFree ?? false;
  const availableAddons = (item.addOns ?? item.addons ?? []).filter(
    (addon) => addon.isAvailable !== false,
  );
  const itemImage = item.image || item.images?.[0]?.url || "";

  // Check if this item is in the cart
  const cartItem = cartItems.find((ci) => ci.id === item.id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;
  const isInCart = itemQuantity > 0;

  const handleAddToCart = () => {
    if (availableAddons.length > 0) {
      setShowAddons(true);
    } else {
      addItem(item, 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (availableAddons.length > 0) {
      setShowAddons(true);
    } else {
      updateQuantity(item.id, itemQuantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (itemQuantity > 1) {
      updateQuantity(item.id, itemQuantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  const handleConfirmAddToCart = () => {
    addItem(item, quantity, selectedAddons, instructions);
    setShowAddons(false);
    setQuantity(1);
    setSelectedAddons([]);
    setInstructions("");
  };

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const getTotalPrice = () => {
    const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return (item.price + addonsPrice) * quantity;
  };

  // Mock spiciness level - in real app would come from item data
  const spicinessLevel = isVegetarian ? 1 : 2; // 0=none, 1=mild, 2=medium, 3=hot

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            p: 2,
            gap: 2,
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transform: "translateY(-2px)",
            },
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #E5E7EB",
            borderRadius: 1,
            backgroundColor: "#FFFFFF",
            overflow: "visible",
          }}
          onClick={() => onViewDetails?.(item)}
        >
          {/* Left Side - Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            {/* Top Row: Spiciness & Veg/Non-Veg */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              {/* Spiciness Indicator */}
              {spicinessLevel > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                  {[...Array(3)].map((_, i) => (
                    <LocalFireDepartment
                      key={i}
                      sx={{
                        fontSize: 14,
                        color: i < spicinessLevel ? "#FF6B35" : "#E0E0E0",
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Veg/Non-Veg Icon */}
              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  border: "1px solid",
                  borderColor: item.isVeg ? "#22C55E" : "#EF4444",
                  borderRadius: 0.5,
                  p: 0.3,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: item.isVeg ? "#22C55E" : "#EF4444",
                  }}
                />
              </Box>
            </Box>

            {/* Item Name */}
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                lineHeight: 1.3,
                color: "#111111",
                mb: 0.5,
              }}
            >
              {item.name}
            </Typography>

            {/* Price */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#111111",
                mb: 1,
              }}
            >
              ₹{item.price}
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{
                color: "#333333",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description}
            </Typography>

            {item.allergens && item.allergens.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {item.allergens.map((allergen) => (
                  <Chip
                    key={allergen}
                    label={allergen}
                    size="small"
                    sx={{ backgroundColor: "#F3F4F6", color: "#333333" }}
                  />
                ))}
              </Box>
            )}

            <Typography
              variant="caption"
              sx={{
                color: "#666666",
                mt: "auto",
                pt: 1,
              }}
            >
              {item.preparationTime
                ? `Prep: ${item.preparationTime} mins`
                : item.weight || ""}
            </Typography>
          </Box>

          {/* Right Side - Image */}
          <Box
            sx={{
              position: "relative",
              width: { xs: "100%", sm: 140, md: 160 },
              height: { xs: 160, sm: 140, md: 160 },
              minWidth: { xs: "100%", sm: 140, md: 160 },
              borderRadius: 1,
              overflow: "visible",
              flexShrink: 0,
            }}
          >
            <img
              src={itemImage}
              alt={item.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 4,
              }}
            />

            {/* Add Button or Quantity Controls - Below image */}
            {isInCart ? (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  right: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#8B0000",
                  borderRadius: 0.5,
                  py: 0.25,
                  px: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecreaseQuantity();
                  }}
                  sx={{
                    color: "#fff",
                    p: 0.5,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {itemQuantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncreaseQuantity();
                  }}
                  sx={{
                    color: "#fff",
                    p: 0.5,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                size="small"
                disabled={item.isAvailable === false}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  right: 8,
                  borderRadius: 0.5,
                  textTransform: "none",
                  px: 2,
                  py: 0.5,
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #8B0000",
                  color: "#111111",
                  "&:hover": {
                    backgroundColor:
                      item.isAvailable === false ? "#FFFFFF" : "#FFF5F5",
                    borderColor: "#8B0000",
                    color: "#111111",
                  },
                }}
              >
                <Add fontSize="small" sx={{ mr: 0.5, color: "#8B0000" }} />
                {item.isAvailable === false ? "Unavailable" : "Add"}
              </Button>
            )}
          </Box>
        </Card>
      </motion.div>

      {/* Addons Modal - Improved */}
      <Dialog
        open={showAddons}
        onClose={() => setShowAddons(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        PaperProps={{
          sx: {
            borderRadius: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: "1px solid #E5E7EB" }}>
          <Typography
            variant="inherit"
            sx={{ fontWeight: 600, color: "#111111" }}
          >
            Customize {item.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {/* Quantity Selector */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 3,
              mt: 1,
            }}
          >
            <IconButton
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              sx={{
                backgroundColor: "#F3F4F6",
                borderRadius: 1,
                "&:hover": { backgroundColor: "#E5E7EB" },
              }}
            >
              <Remove />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                minWidth: 40,
                textAlign: "center",
                color: "#111111",
                fontWeight: 600,
              }}
            >
              {quantity}
            </Typography>
            <IconButton
              onClick={() => setQuantity((q) => q + 1)}
              sx={{
                backgroundColor: "#F3F4F6",
                borderRadius: 1,
                "&:hover": { backgroundColor: "#E5E7EB" },
              }}
            >
              <Add />
            </IconButton>
          </Box>

          {/* Addons */}
          {availableAddons.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: "#111111" }}
              >
                Add-ons
              </Typography>
              <Stack spacing={1}>
                {availableAddons.map((addon) => {
                  const isSelected = selectedAddons.some(
                    (a) => a.id === addon.id,
                  );
                  return (
                    <Box
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: isSelected ? "#FF6B35" : "#E5E7EB",
                        backgroundColor: isSelected
                          ? "rgba(255, 107, 53, 0.08)"
                          : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#111111" }}>
                        {addon.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#FF6B35", fontWeight: 600 }}
                      >
                        +₹{addon.price}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Special Instructions */}
          <TextField
            fullWidth
            label="Special Instructions"
            multiline
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Any special requests? (optional)"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "& fieldset": {
                  borderColor: "#E5E7EB",
                },
                "&:hover fieldset": {
                  borderColor: "#D1D5DB",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FF6B35",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#666666",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, borderTop: "1px solid #E5E7EB" }}>
          <Button
            onClick={() => setShowAddons(false)}
            sx={{ color: "#666666" }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleConfirmAddToCart}
            sx={{
              px: 3,
              borderRadius: 1,
              backgroundColor: "#FFFFFF",
              border: "2px solid #8B0000",
              color: "#111111",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#FFF5F5",
                borderColor: "#8B0000",
                color: "#111111",
              },
            }}
          >
            Add to Cart - ₹{getTotalPrice().toFixed(2)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
