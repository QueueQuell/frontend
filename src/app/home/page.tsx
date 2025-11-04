"use client";
import Link from "next/link";
import CommonLayout from "../components/CommonLayout";
import CommonCard from "../components/CommonCard";
import PageHeader from "../components/PageHeader";
import { Box, Grid, Card, CardContent, Typography, Avatar } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import QrCodeIcon from "@mui/icons-material/QrCode";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import StarIcon from "@mui/icons-material/Star";

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

const stats = [
  {
    title: "Total Revenue",
    value: "$12,345",
    change: "+12.5%",
    icon: AttachMoneyIcon,
    color: "success.main",
  },
  {
    title: "Orders Today",
    value: "156",
    change: "+8.2%",
    icon: ShoppingBasketIcon,
    color: "primary.main",
  },
  {
    title: "Active Tables",
    value: "23",
    change: "+4.1%",
    icon: RestaurantMenuIcon,
    color: "warning.main",
  },
  {
    title: "Customer Rating",
    value: "4.8",
    change: "+0.3",
    icon: StarIcon,
    color: "secondary.main",
  },
];

export default function Home() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's what's happening with your restaurant today."
        />

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                      <stat.icon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TrendingUpIcon sx={{ color: "success.main", mr: 0.5, fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: "success.main", fontWeight: "bold" }}>
                      {stat.change}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Quick Actions
        </Typography>
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
