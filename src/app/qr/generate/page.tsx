"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Link from "next/link";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Breadcrumb from "../../components/ui/Breadcrumb";
import PageFooter from "@/app/components/ui/PageFooter";

export default function GenerateQRPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "QR", href: "/qr" },
            { label: "Generate" },
          ]}
        />
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
        <PageFooter backHref="/qr" backText="Back to QR Codes" />
      </Box>
    </CommonLayout>
  );
}
