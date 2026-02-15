"use client";
import { Box, Grid, Typography } from "@mui/material";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentOrders from "@/components/dashboard/RecentOrders";
import TopItems from "@/components/dashboard/TopItems";

export default function ModernDashboard() {
  return (
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
      <StatsCards />

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 8 }}>
          <QuickActions />
          <RecentOrders />
        </Grid>

        {/* Top Selling Items */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TopItems />
        </Grid>
      </Grid>
    </Box>
  );
}
