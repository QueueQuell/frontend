"use client";
import Link from "next/link";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, TextField, Button, Paper, Grid, MenuItem, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import Breadcrumb from "../../components/ui/Breadcrumb";

export default function InventoryAdjustPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Inventory", href: "/inventory" },
            { label: "Adjust" },
          ]}
        />
        <Paper sx={{ p: 3, maxWidth: 800 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                label="Select Item"
                defaultValue=""
                required
              >
                <MenuItem value="item1">Margherita Pizza (Current: 50 pcs)</MenuItem>
                <MenuItem value="item2">Caesar Salad (Current: 30 kg)</MenuItem>
                <MenuItem value="item3">Grilled Chicken Sandwich (Current: 20 pcs)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Adjustment Type
              </Typography>
              <RadioGroup row defaultValue="increase">
                <FormControlLabel value="increase" control={<Radio />} label="Increase Stock" />
                <FormControlLabel value="decrease" control={<Radio />} label="Decrease Stock" />
              </RadioGroup>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Adjustment Quantity"
                type="number"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Reason"
                defaultValue=""
                required
              >
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="damage">Damage</MenuItem>
                <MenuItem value="expiry">Expiry</MenuItem>
                <MenuItem value="correction">Correction</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                placeholder="Optional notes about this adjustment"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="contained" color="primary" size="large">
                Apply Adjustment
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Box sx={{ mt: 2 }}>
          <Button component={Link} href="/inventory" variant="outlined">
            ← Back to Inventory
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
