"use client";
import CommonLayout from "../components/CommonLayout";
import CommonCard from "../components/CommonCard";
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import { Box, Grid } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";

const orderActions = [
  { href: "/orders/list", label: "Order List", icon: ListIcon, description: "View all orders and their status" },
  { href: "/orders/create", label: "Create Order", icon: AddIcon, description: "Create new customer order" },
  { href: "/orders/kitchen", label: "Kitchen View", icon: ShoppingCartIcon, description: "Kitchen order management" },
];

export default function OrdersPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Order Management"
          description="View and manage customer orders"
        />
        <Grid container spacing={3}>
          {orderActions.map((action) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={action.href}>
              <CommonCard
                title={action.label}
                description={action.description}
                icon={action.icon}
                href={action.href}
              />
            </Grid>
          ))}
        </Grid>
        <PageFooter backHref="/home" backText="Back to Home" />
      </Box>
    </CommonLayout>
  );
}
