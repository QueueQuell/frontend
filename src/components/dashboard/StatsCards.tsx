import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  LinearProgress,
  Chip,
  alpha,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

export default function StatsCards() {
  return (
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
                  0.12,
                )}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack
                direction="row"
                sx={{
                  mb: 2,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
                  <stat.icon
                    sx={{ fontSize: 24, color: `${stat.color}.main` }}
                  />
                </Box>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1.5, display: "block" }}
              >
                {stat.title}
              </Typography>

              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center" }}
              >
                {stat.trend === "up" ? (
                  <TrendingUpIcon
                    sx={{ fontSize: 20, color: "success.main" }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{ fontSize: 20, color: "error.main" }}
                  />
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
  );
}
