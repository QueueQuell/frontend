import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Button,
  LinearProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Link from "next/link";
import { alpha } from "@mui/material";

const topItems = [
  { name: "Margherita Pizza", orders: 45, revenue: "₹675", trend: 12 },
  { name: "Caesar Salad", orders: 38, revenue: "₹456", trend: 8 },
  { name: "Pasta Carbonara", orders: 32, revenue: "₹512", trend: -3 },
  { name: "Grilled Chicken", orders: 28, revenue: "₹448", trend: 15 },
];

export default function TopItems() {
  return (
    <Card
      sx={{
        boxShadow: (theme) =>
          `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(
            theme.palette.grey[500],
            0.12,
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
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 0.5 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {item.trend > 0 ? (
                    <TrendingUpIcon
                      sx={{ fontSize: 14, color: "success.main" }}
                    />
                  ) : (
                    <TrendingDownIcon
                      sx={{ fontSize: 14, color: "error.main" }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: item.trend > 0 ? "success.main" : "error.main",
                      fontSize: "0.7rem",
                    }}
                  >
                    {Math.abs(item.trend)}%
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 0.75 }}
              >
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
          href="/catalog/items"
          fullWidth
          size="small"
          variant="outlined"
          sx={{ mt: 2, textTransform: "none", borderRadius: 1 }}
        >
          View All Items
        </Button>
      </CardContent>
    </Card>
  );
}
