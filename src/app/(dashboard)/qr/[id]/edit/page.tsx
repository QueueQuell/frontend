"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useParams } from "next/navigation";
import { qrService } from "@/lib/api/services/qr.service";
import type { AdminQRListItem } from "@/lib/api/types";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import SnackbarAlert from "@/components/ui/SnackbarAlert";

export default function QREditPage() {
  const params = useParams();
  const id = params.id as string;

  const [qr, setQr] = useState<AdminQRListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [toggleDialog, setToggleDialog] = useState({
    open: false,
    isActive: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchQR = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await qrService.getById(id);
      if (response.success && response.data) {
        setQr(response.data as any as AdminQRListItem);
      } else {
        setError(response.message || "Failed to load QR code");
      }
    } catch (err: any) {
      setError(err.message || "Error loading QR code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchQR();
  }, [id]);

  const handleToggleOpen = (isActive: boolean) => {
    setToggleDialog({ open: true, isActive });
  };

  const handleToggleClose = () => {
    setToggleDialog({ ...toggleDialog, open: false });
  };

  const handleToggleConfirm = async () => {
    if (toggleDialog.open) {
      setSaving(true);
      try {
        const response = toggleDialog.isActive
          ? await qrService.reactivate(id)
          : await qrService.deactivate(id);
        if (response.success && response.data) {
          setQr(response.data as any as AdminQRListItem);
          setSnackbar({
            open: true,
            message: toggleDialog.isActive
              ? "QR code activated"
              : "QR code deactivated",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: response.message || "Toggle failed",
            severity: "error",
          });
        }
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to toggle QR status",
          severity: "error",
        });
      } finally {
        setSaving(false);
        handleToggleClose();
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDownloadQR = () => {
    if (qr?.qrImageUrl) {
      const link = document.createElement("a");
      link.href = qr.qrImageUrl;
      link.download = `qr-${qr.tableNumber || qr.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !qr) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "QR code not found"}</Alert>
      </Box>
    );
  }

  const title = qr.tableNumber ? `Table ${qr.tableNumber}` : qr.id.slice(-8);

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "QR", href: "/qr" },
          { label: `Edit ${title}` },
        ]}
      />

      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          <QrCodeIcon sx={{ mr: 1 }} />
          Manage QR - {title}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                bgcolor: "grey.50",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <img
                src={qr.qrImageUrl}
                alt="QR Code"
                style={{ width: 200, height: 200, objectFit: "contain" }}
              />
            </Box>
            <Box
              sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "center" }}
            >
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadQR}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboard(qr.qrUrl || "")}
              >
                Copy URL
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 2 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 100 }}
              >
                ID
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {qr.id}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                QR String
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {qr.qrString}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                URL
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {qr.qrUrl}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Table
              </Typography>
              <Typography variant="body2">{qr.tableNumber || "-"}</Typography>

              <Typography variant="body2" color="text.secondary">
                Order Type
              </Typography>
              <Typography variant="body2">{qr.orderType || "-"}</Typography>

              <Typography variant="body2" color="text.secondary">
                Scans
              </Typography>
              <Typography variant="body2">{qr.scannedCount || 0}</Typography>

              <Typography variant="body2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2">
                {new Date(qr.createdAt).toLocaleString()}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body2">
                {qr.metadata?.notes || "-"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={qr.isActive}
                onChange={(e) => handleToggleOpen(!qr.isActive)}
                disabled={saving}
              />
            }
            label="Active"
          />
          <Chip
            label={qr.isActive ? "Active" : "Inactive"}
            color={qr.isActive ? "success" : "default"}
            sx={{ ml: 2 }}
          />
        </Box>
      </Paper>

      <Dialog open={toggleDialog.open} onClose={handleToggleClose}>
        <DialogTitle>
          {toggleDialog.isActive ? "Activate" : "Deactivate"} QR Code
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm {toggleDialog.isActive ? "activate" : "deactivate"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleToggleConfirm}
            variant="contained"
            color={toggleDialog.isActive ? "success" : "error"}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : toggleDialog.isActive
                ? "Activate"
                : "Deactivate"}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      <PageFooter backHref="/qr/list" backText="Back to QR List" />
    </Box>
  );
}
