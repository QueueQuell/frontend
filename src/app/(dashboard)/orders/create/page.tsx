"use client";
import { Typography, Box, Button } from "@mui/material";
import Link from "next/link";
import OrderForm from "@/components/orders/OrderForm";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";

export default function CreateOrderPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Orders", href: "/orders" },
          { label: "Create" },
        ]}
      />
      <OrderForm />
      <PageFooter backHref="/orders" backText="Back to Orders" />
    </Box>
  );
}
