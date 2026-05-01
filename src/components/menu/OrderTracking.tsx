"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Search,
  CheckCircle,
  Schedule,
  LocalShipping,
  Restaurant,
  DoneAll,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface OrderStatus {
  orderId: string;
  customerName: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed";
  items: { name: string; quantity: number }[];
  total: number;
  estimatedTime?: number;
  createdAt: string;
}

const statusSteps = ["Pending", "Confirmed", "Preparing", "Ready", "Completed"];
const statusIcons = [Schedule, Schedule, Restaurant, LocalShipping, DoneAll];

const mockOrders: Record<string, OrderStatus> = {
  QQ001: {
    orderId: "QQ001",
    customerName: "John Doe",
    status: "preparing",
    items: [
      { name: "Chicken Wings", quantity: 2 },
      { name: "Caesar Salad", quantity: 1 },
    ],
    total: 350,
    estimatedTime: 15,
    createdAt: new Date().toISOString(),
  },
  QQ002: {
    orderId: "QQ002",
    customerName: "Jane Smith",
    status: "ready",
    items: [{ name: "Grilled Salmon", quantity: 1 }],
    total: 625,
    estimatedTime: 0,
    createdAt: new Date().toISOString(),
  },
};

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundOrder = mockOrders[orderNumber.toUpperCase()];

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setError("Order not found. Please check your order number.");
      setOrder(null);
    }

    setIsLoading(false);
  };

  const getActiveStep = () => {
    if (!order) return 0;
    const statusIndex = statusSteps.findIndex(
      (s) => s.toLowerCase() === order.status,
    );
    return statusIndex >= 0 ? statusIndex : 0;
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Track Your Order
      </Typography>

      {/* Search Box */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="Order Number"
            placeholder="Enter your order number (e.g., QQ001)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrackOrder()}
            slotProps={{
              input: {
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleTrackOrder}
            disabled={isLoading}
            sx={{ px: 4 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Track"
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Order Status */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            sx={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <CardContent>
              {/* Order Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Order #{order.orderId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customerName}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    ₹{order.total.toFixed(2)}
                  </Typography>
                  {order.estimatedTime && order.estimatedTime > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      ~{order.estimatedTime} mins
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Status Stepper */}
              <Stepper
                activeStep={getActiveStep()}
                alternativeLabel
                sx={{ mb: 4 }}
              >
                {statusSteps.map((label, index) => {
                  const IconComponent = statusIcons[index];
                  return (
                    <Step key={label}>
                      <StepLabel
                        slots={{
                          stepIcon: () => (
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  index <= getActiveStep()
                                    ? "var(--primary)"
                                    : "var(--surface-hover)",
                                color:
                                  index <= getActiveStep()
                                    ? "#fff"
                                    : "text.secondary",
                              }}
                            >
                              <IconComponent fontSize="small" />
                            </Box>
                          ),
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: index === getActiveStep() ? 600 : 400,
                            color:
                              index <= getActiveStep()
                                ? "var(--text-primary)"
                                : "text.secondary",
                          }}
                        >
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              <Divider sx={{ my: 2 }} />

              {/* Order Items */}
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Order Items
              </Typography>
              {order.items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.quantity}x {item.name}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Demo Orders */}
      {!order && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Demo orders to try:
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {Object.keys(mockOrders).map((orderId) => (
              <Button
                key={orderId}
                variant="outlined"
                onClick={() => {
                  setOrderNumber(orderId);
                  setOrder(mockOrders[orderId]);
                }}
                sx={{ textTransform: "none" }}
              >
                {orderId}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
