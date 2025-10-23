"use client";
import CommonLayout from "../../components/CommonLayout";
import { Typography, Box, Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Link from "next/link";
import QrCodeIcon from "@mui/icons-material/QrCode";

export default function GenerateQRPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Generate QR Code
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create QR codes for tables, menus, or custom links
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                QR Code Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>QR Type</InputLabel>
                    <Select label="QR Type">
                      <MenuItem value="table">Table</MenuItem>
                      <MenuItem value="menu">Menu</MenuItem>
                      <MenuItem value="custom">Custom Link</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Table Number / Identifier" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Custom URL (optional)" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Description" multiline rows={2} variant="outlined" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box sx={{ bgcolor: "#f5f5f5", height: 200, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <QrCodeIcon sx={{ fontSize: 80, color: "#666" }} />
              </Box>
              <Button variant="contained" fullWidth startIcon={<QrCodeIcon />}>
                Generate QR Code
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/qr" variant="outlined">
            ← Back to QR Codes
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
