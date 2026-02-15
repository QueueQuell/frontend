import React from "react";
import { Grid, Card, CardContent, Typography, Paper, Box, Button, IconButton } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import QrCodeIcon from "@mui/icons-material/QrCode";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import { alpha } from "@mui/material";

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

export default function QuickActions() {
  return (
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
  );
}
