"use client";
import Link from "next/link";
import CommonLayout from "../components/CommonLayout";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  Stack,
  LinearProgress,
  Chip,
  alpha,
  Button,
  IconButton,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import QrCodeIcon from "@mui/icons-material/QrCode";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const stats = [
  {
    title: "Total Revenue",
    value: "₹12,345",
    change: "+12.5%",
    trend: "up",
    icon: AttachMoneyIcon,
    color: "primary",
    bgColor: "primary.lighter",
  },
  {
    title: "Orders Today",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBasketIcon,
    color: "info",
    bgColor: "info.lighter",
  },
  {
    title: "Active Tables",
    value: "23",
    change: "-2.1%",
    trend: "down",
    icon: RestaurantMenuIcon,
    color: "warning",
    bgColor: "warning.lighter",
  },
  {
    title: "Customer Rating",
    value: "4.8",
    change: "+0.3",
    trend: "up",
    icon: StarIcon,
    color: "success",
    bgColor: "success.lighter",
  },
];

const quickActions = [
  {
    href: "/orders/create",
    label: "New Order",
    icon: ShoppingCartIcon,
    color: "primary",
    description: "Create a new order",
  },
  {
    href: "/inventory/add",
    label: "Add Inventory",
    icon: InventoryIcon,
    color: "success",
    description: "Add new inventory item",
  },
  {
    href: "/qr/generate",
    label: "Generate QR",
    icon: QrCodeIcon,
    color: "info",
    description: "Generate table QR code",
  },
  {
    href: "/customers/add",
    label: "New Customer",
    icon: PersonIcon,
    color: "secondary",
    description: "Add new customer",
  },
];

const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", amount: "₹45.50", status: "Completed", time: "2 min ago" },
  { id: "#ORD-002", customer: "Jane Smith", amount: "₹32.00", status: "Preparing", time: "5 min ago" },
  { id: "#ORD-003", customer: "Bob Johnson", amount: "₹78.25", status: "Pending", time: "8 min ago" },
  { id: "#ORD-004", customer: "Alice Brown", amount: "₹56.75", status: "Completed", time: "12 min ago" },
];

const topItems = [
  { name: "Margherita Pizza", orders: 45, revenue: "₹675", trend: 12 },
  { name: "Caesar Salad", orders: 38, revenue: "₹456", trend: 8 },
  { name: "Pasta Carbonara", orders: 32, revenue: "₹512", trend: -3 },
  { name: "Grilled Chicken", orders: 28, revenue: "₹448", trend: 15 },
];

export default function ModernDashboard() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's what's happening with your restaurant today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  overflow: "visible",
                  boxShadow: (theme) =>
                    `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(
                      theme.palette.grey[500],
                      0.12
                    )}`,
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: (theme) => {
                          const palette = theme.palette as any;
                          return alpha(palette[stat.color].main, 0.12);
                        },
                      }}
                    >
                      <stat.icon sx={{ fontSize: 24, color: `${stat.color}.main` }} />
                    </Box>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                    {stat.title}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {stat.trend === "up" ? (
                      <TrendingUpIcon sx={{ fontSize: 20, color: "success.main" }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 20, color: "error.main" }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: stat.trend === "up" ? "success.main" : "error.main",
                      }}
                    >
                      {stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs last month
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                boxShadow: (theme) =>
                  `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(
                    theme.palette.grey[500],
                    0.12
                  )}`,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                      <Paper
                        component={Link}
                        href={action.href}
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          textDecoration: "none",
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1.5,
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: `${action.color}.main` as any,
                            bgcolor: (theme) => {
                              const palette: any = theme.palette;
                              return alpha(palette[action.color].main, 0.04);
                            },
                            transform: "translateY(-2px)",
                            boxShadow: (theme) => {
                              const palette: any = theme.palette;
                              return `0 12px 24px -4px ${alpha(palette[action.color].main, 0.24)}`;
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: (theme) => {
                              const palette: any = theme.palette;
                              return alpha(palette[action.color].main, 0.12);
                            },
                            mr: 1.5,
                          }}
                        >
                          <action.icon sx={{ fontSize: 20, color: `${action.color}.main` as any }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                            {action.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {action.description}
                          </Typography>
                        </Box>
                        <ArrowForwardIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card
              sx={{
                boxShadow: (theme) =>
                  `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(
                    theme.palette.grey[500],
                    0.12
                  )}`,
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Recent Orders
                  </Typography>
                  <Button
                    component={Link}
                    href="/orders/list"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ textTransform: "none" }}
                  >
                    View All
                  </Button>
                </Stack>

                <Stack spacing={1.5}>
                  {recentOrders.map((order, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 1.5,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                            {order.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customer}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right", mr: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                            {order.amount}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {order.time}
                          </Typography>
                        </Box>
                        <Chip
                          label={order.status}
                          size="small"
                          color={
                            order.status === "Completed"
                              ? "success"
                              : order.status === "Preparing"
                              ? "warning"
                              : "default"
                          }
                          sx={{ minWidth: 80, height: 24, fontSize: '0.7rem' }}
                        />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Selling Items */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                boxShadow: (theme) =>
                  `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(
                    theme.palette.grey[500],
                    0.12
                  )}`,
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Top Selling Items
                </Typography>

                <Stack spacing={2}>
                  {topItems.map((item, index) => (
                    <Box key={index}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {item.trend > 0 ? (
                            <TrendingUpIcon sx={{ fontSize: 14, color: "success.main" }} />
                          ) : (
                            <TrendingDownIcon sx={{ fontSize: 14, color: "error.main" }} />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: item.trend > 0 ? "success.main" : "error.main",
                              fontSize: '0.7rem',
                            }}
                          >
                            {Math.abs(item.trend)}%
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.75 }}>
                        <Typography variant="caption" color="text.secondary">
                          {item.orders} orders
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {item.revenue}
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={(item.orders / 50) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            bgcolor: item.trend > 0 ? "success.main" : "warning.main",
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>

                <Button
                  component={Link}
                  href="/items/catalog"
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ mt: 2, textTransform: "none", borderRadius: 1 }}
                >
                  View All Items
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </CommonLayout>
  );
}
