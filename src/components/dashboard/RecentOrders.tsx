import React from "react";
import { Card, CardContent, Typography, Stack, Paper, Box, Button, Chip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import { alpha } from "@mui/material";

const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", amount: "₹45.50", status: "Completed", time: "2 min ago" },
  { id: "#ORD-002", customer: "Jane Smith", amount: "₹32.00", status: "Preparing", time: "5 min ago" },
  { id: "#ORD-003", customer: "Bob Johnson", amount: "₹78.25", status: "Pending", time: "8 min ago" },
  { id: "#ORD-004", customer: "Alice Brown", amount: "₹56.75", status: "Completed", time: "12 min ago" },
];

export default function RecentOrders() {
  return (
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
  );
}
