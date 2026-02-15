import { Typography, Box, Paper, Grid, Avatar, Button, Chip } from "@mui/material";
import Link from "next/link";
import React from "react";
import Inventory2Icon from "@mui/icons-material/Inventory2";

type Props = { params: { id: string } };

export default function InventoryItemPage({ params }: Props) {
  const { id } = params;
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Item — {id}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Item details and history
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
              <Inventory2Icon sx={{ fontSize: 40 }} />
            </Avatar>
          </Grid>
          <Grid size={{ xs: 12, sm: 10 }}>
            <Typography variant="h5" gutterBottom>
              Margherita Pizza
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              SKU: SKU-12345
            </Typography>
            <Chip label="Food" color="primary" size="small" sx={{ mr: 1 }} />
            <Chip label="Main Kitchen" color="secondary" size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6">Current Stock</Typography>
            <Typography variant="h4" color="primary">50 pcs</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6">Unit Cost</Typography>
            <Typography variant="h4">₹12.99</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6">Total Value</Typography>
            <Typography variant="h4">₹649.50</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6">Last Updated</Typography>
            <Typography variant="body1">2023-10-15</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Stock History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Recent stock movements and adjustments will be displayed here.
        </Typography>
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Link href="/inventory">
          <Button variant="outlined">
            ← Back to Inventory
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export async function generateStaticParams() {
  // For static export, we need to provide static params for dynamic routes.
  // Since this is a demo, we'll generate a few example IDs.
  // In a real app, fetch from your data source.
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}
