"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import {
  PhoneAndroid,
  CreditCard,
  AccountBalance,
  CheckCircle,
  QrCode2,
  Receipt,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface PaymentPageProps {
  cart: CartItem[];
  totalAmount: number;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

type PaymentMethod = "upi" | "cash" | "card";

const steps = ["Cart Review", "Payment", "Confirmation"];

export default function PaymentPage({
  cart,
  totalAmount,
  onPaymentSuccess,
  onBack,
}: PaymentPageProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [validationError, setValidationError] = useState("");

  const tax = totalAmount * 0.1;
  const finalTotal = totalAmount + tax;

  // UPI QR Code (mock - would be generated from actual UPI ID)
  const upiId = "queuequell@upi";
  const upiAmount = finalTotal.toFixed(2);

  const handleContinueToPayment = () => {
    // Validate input fields before proceeding to payment
    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError("Please fill in your name and phone number");
      return;
    }

    setValidationError("");
    setActiveStep(1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setActiveStep(2);
  };

  const handlePaymentSuccess = () => {
    onPaymentSuccess();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button
          onClick={onBack}
          disabled={activeStep === 2}
          sx={{ color: "#666666" }}
        >
          ← Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#111111" }}>
          Checkout
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ "& .MuiStepLabel-label": { color: "#666666" } }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Paper
            sx={{
              p: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#111111" }}
            >
              Order Summary
            </Typography>

            {/* Cart Items */}
            <Box sx={{ mb: 3 }}>
              {cart.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#333333" }}>
                    {item.quantity}x {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: "#111111" }}
                  >
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Totals */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" sx={{ color: "#666666" }}>
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ color: "#111111" }}>
                ₹{totalAmount.toFixed(2)}
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
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#111111" }}
              >
                Total
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#111111", fontWeight: 700 }}
              >
                ₹{finalTotal.toFixed(2)}
              </Typography>
            </Box>

            {/* Customer Details */}
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, fontWeight: 600, color: "#111111" }}
            >
              Customer Details
            </Typography>

            {/* Validation Error */}
            {validationError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                {validationError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  error={!!validationError && !customerName.trim()}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      "& fieldset": { borderColor: "#E5E7EB" },
                      "&:hover fieldset": { borderColor: "#D1D5DB" },
                      "&.Mui-focused fieldset": { borderColor: "#8B0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#666666" },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  error={!!validationError && !customerPhone.trim()}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      "& fieldset": { borderColor: "#E5E7EB" },
                      "&:hover fieldset": { borderColor: "#D1D5DB" },
                      "&.Mui-focused fieldset": { borderColor: "#8B0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#666666" },
                  }}
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleContinueToPayment}
              sx={{
                mt: 3,
                py: 1.5,
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
              Continue to Payment
            </Button>
          </Paper>
        </motion.div>
      )}

      {activeStep === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Paper
            sx={{
              p: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#111111" }}
            >
              Payment Method
            </Typography>

            {/* Payment Methods */}
            <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
              >
                {/* Cash on Counter */}
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "2px solid",
                    borderColor:
                      paymentMethod === "cash" ? "#8B0000" : "#E5E7EB",
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <FormControlLabel
                    value="cash"
                    control={
                      <Radio
                        sx={{
                          color: "#666666",
                          "&.Mui-checked": { color: "#8B0000" },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccountBalance sx={{ color: "#666666" }} />
                        <Typography fontWeight={500} sx={{ color: "#111111" }}>
                          Cash on Counter
                        </Typography>
                        <Chip
                          label="Popular"
                          size="small"
                          sx={{ backgroundColor: "#8B0000", color: "#fff" }}
                        />
                      </Box>
                    }
                    sx={{ width: "100%" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "#666666", ml: 6, mt: -1 }}
                  >
                    Pay at the counter when you pick up your order
                  </Typography>
                </Paper>

                {/* UPI Payment - Disabled */}
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "2px solid",
                    borderColor: "#E5E7EB",
                    borderRadius: 1,
                    cursor: "not-allowed",
                    opacity: 0.6,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <FormControlLabel
                    value="upi"
                    control={<Radio sx={{ color: "#9CA3AF" }} />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PhoneAndroid sx={{ color: "#9CA3AF" }} />
                        <Typography fontWeight={500} sx={{ color: "#9CA3AF" }}>
                          UPI Payment
                        </Typography>
                      </Box>
                    }
                    sx={{ width: "100%" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "#9CA3AF", ml: 6, mt: -1 }}
                  >
                    Scan QR code to pay via any UPI app
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      ml: 6,
                      mt: 1,
                      color: "#8B0000",
                      fontWeight: 600,
                    }}
                  >
                    🚧 Coming Soon
                  </Typography>
                </Paper>

                {/* Card Payment - Disabled */}
                <Paper
                  sx={{
                    p: 2,
                    border: "2px solid",
                    borderColor: "#E5E7EB",
                    borderRadius: 1,
                    cursor: "not-allowed",
                    opacity: 0.6,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio sx={{ color: "#9CA3AF" }} disabled />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CreditCard sx={{ color: "#9CA3AF" }} />
                        <Typography fontWeight={500} sx={{ color: "#9CA3AF" }}>
                          Card Payment
                        </Typography>
                      </Box>
                    }
                    sx={{ width: "100%" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "#9CA3AF", ml: 6, mt: -1 }}
                  >
                    Pay with debit/credit card
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      ml: 6,
                      mt: 1,
                      color: "#8B0000",
                      fontWeight: 600,
                    }}
                  >
                    🚧 Coming Soon
                  </Typography>
                </Paper>
              </RadioGroup>
            </FormControl>

            {/* UPI QR Code Display */}
            {paymentMethod === "upi" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, color: "#111111" }}
                >
                  Scan to Pay via UPI
                </Typography>

                {/* QR Code Box */}
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    border: "2px solid #E5E7EB",
                  }}
                >
                  {/* Mock QR Code - In production, use a QR code library */}
                  <Box sx={{ textAlign: "center" }}>
                    <QrCode2 sx={{ fontSize: 120, color: "#000" }} />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ color: "#666666" }}
                    >
                      Scan with any UPI App
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: "#666666", mb: 1 }}>
                  UPI ID:{" "}
                  <Typography variant="inherit" sx={{ color: "#111111" }}>
                    {upiId}
                  </Typography>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#111111", fontWeight: 600 }}
                >
                  Amount: ₹{upiAmount}
                </Typography>

                <Alert
                  severity="info"
                  sx={{
                    mt: 2,
                    width: "100%",
                    borderRadius: 1,
                    backgroundColor: "#EFF6FF",
                    color: "#1E40AF",
                  }}
                >
                  After payment, show the transaction ID to the counter staff
                </Alert>
              </Box>
            )}

            {/* Amount Summary */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                backgroundColor: "#F3F4F6",
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography
                variant="body1"
                fontWeight={500}
                sx={{ color: "#111111" }}
              >
                Total Amount to Pay
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: "#111111", fontWeight: 700 }}
              >
                ₹{finalTotal.toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handlePayment}
              disabled={isProcessing}
              sx={{
                py: 1.5,
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
              {isProcessing ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={24} sx={{ color: "#8B0000" }} />
                  <Typography sx={{ color: "#111111" }}>
                    Processing...
                  </Typography>
                </Box>
              ) : (
                `Pay ₹${finalTotal.toFixed(2)}`
              )}
            </Button>
          </Paper>
        </motion.div>
      )}

      {activeStep === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Paper
            sx={{
              p: 4,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: "#fff" }} />
            </Box>

            <Typography
              variant="h5"
              sx={{ mb: 1, fontWeight: 600, color: "#111111" }}
            >
              Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#666666" }}>
              Thank you for your order
            </Typography>

            <Card
              sx={{
                maxWidth: 300,
                mx: "auto",
                mb: 3,
                backgroundColor: "#F3F4F6",
                borderRadius: 1,
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: "#666666" }}>
                  Order Number
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: "#8B0000" }}
                >
                  QQ{Math.floor(Math.random() * 9000) + 1000}
                </Typography>
              </CardContent>
            </Card>

            <Typography variant="body2" sx={{ mb: 3, color: "#666666" }}>
              {paymentMethod === "cash"
                ? "Please collect your order from the counter"
                : "Your payment has been processed successfully"}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                startIcon={<Receipt />}
                sx={{
                  borderRadius: 1,
                  borderColor: "#E5E7EB",
                  color: "#666666",
                }}
              >
                View Receipt
              </Button>
              <Button
                variant="outlined"
                onClick={handlePaymentSuccess}
                sx={{
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
                Done
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
}
