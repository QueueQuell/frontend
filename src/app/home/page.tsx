"use client";
import Link from "next/link";
import CommonLayout from "../components/CommonLayout";
import CommonCard from "../components/CommonCard";
import PageHeader from "../components/PageHeader";
import { Box, Grid } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import QrCodeIcon from "@mui/icons-material/QrCode";

const menuItems = [
  { href: "/inventory", label: "Inventory Management", icon: InventoryIcon },
  { href: "/orders", label: "Order Management", icon: ShoppingCartIcon },
  { href: "/users", label: "User Management", icon: PeopleIcon },
  { href: "/payments", label: "Payments", icon: PaymentIcon },
  { href: "/items", label: "Items", icon: RestaurantMenuIcon },
  { href: "/suppliers", label: "Suppliers", icon: LocalShippingIcon },
  { href: "/customers", label: "Customers", icon: PersonIcon },
  { href: "/qr", label: "QR Management", icon: QrCodeIcon },
];

export default function Home() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Restaurant Management — Home"
          description="Quick links to each area of the app:"
        />
        <Grid container spacing={3}>
          {menuItems.map((val) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={val.href}>
              <CommonCard
                title={val.label}
                icon={val.icon}
                href={val.href}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </CommonLayout>
  );
}
