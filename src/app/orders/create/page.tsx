"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, Button } from "@mui/material";
import Link from "next/link";
import OrderForm from "../../components/orders/OrderForm";

export default function CreateOrderPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Order
        </Typography>
        <OrderForm />
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/orders" variant="outlined">
            ← Back to Orders
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
