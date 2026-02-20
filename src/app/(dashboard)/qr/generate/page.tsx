"use client";

import { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { qrService } from "@/lib/api/services/qr.service";
import {
  AdminQRGenerateResponse,
  AdminQRGenerateRequest,
} from "@/lib/api/types";

export default function GenerateQRPage() {
  // QR Code generation page - allows generating QR codes with optional parameters
  const [qrType, setQrType] = useState<string>("table");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("dine-in");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [qrData, setQrData] = useState<AdminQRGenerateResponse | null>(null);

  const handleGenerateQR = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    setQrData(null);

    try {
      // Get baseUrl from window.location
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : undefined;

      // Prepare request - all fields are optional, org ID is extracted from token
      const requestData: AdminQRGenerateRequest = {
        tableNumber: tableNumber || undefined,
        orderType: (orderType ||
          undefined) as AdminQRGenerateRequest["orderType"],
        baseUrl: baseUrl,
      };

      const response = await qrService.generateAdminQR(requestData);

      if (response.success && response.data) {
        setQrData(response.data);
        setSuccess(true);
      } else {
        setError(response.message || "Failed to generate QR code");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while generating QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQrData(null);
    setSuccess(false);
    setError("");
    setTableNumber("");
    setCustomUrl("");
    setDescription("");
  };

  return (
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Organization ID is automatically extracted from your login token.
              All other options are optional.
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>QR Type</InputLabel>
                  <Select
                    value={qrType}
                    label="QR Type"
                    onChange={(e) => setQrType(e.target.value)}
                  >
                    <MenuItem value="table">Table</MenuItem>
                    <MenuItem value="menu">Menu</MenuItem>
                    <MenuItem value="custom">Custom Link</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {qrType === "table" && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Table Number (Optional)"
                      variant="outlined"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="e.g., T15"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Order Type (Optional)</InputLabel>
                      <Select
                        value={orderType}
                        label="Order Type (Optional)"
                        onChange={(e) => setOrderType(e.target.value)}
                      >
                        <MenuItem value="dine-in">Dine-in</MenuItem>
                        <MenuItem value="takeout">Takeout</MenuItem>
                        <MenuItem value="delivery">Delivery</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              {qrType === "custom" && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Custom URL (Optional)"
                    variant="outlined"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/custom-page"
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={2}
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description for this QR code"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>

            {success && qrData ? (
              <Box>
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    p: 1,
                  }}
                >
                  <img
                    src={qrData.qrImageUrl}
                    alt="QR Code"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  QR ID: {qrData.qrId}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  QR String: {qrData.qrString}
                </Typography>
                {qrData.tableNumber && (
                  <Typography variant="body2" color="text.secondary">
                    Table: {qrData.tableNumber}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Generate Another
                </Button>
              </Box>
            ) : (
              <Box>
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <QrCodeIcon sx={{ fontSize: 80, color: "#666" }} />
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <QrCodeIcon />
                    )
                  }
                  onClick={handleGenerateQR}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate QR Code"}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {error && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>
      <PageFooter backHref="/qr" backText="Back to QR Codes" />
    </Box>
  );
}
