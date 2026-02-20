"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { qrService } from "@/lib/api/services/qr.service";
import { AdminQRListItem } from "@/lib/api/types";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";

export default function QRListPage() {
  const [qrCodes, setQrCodes] = useState<AdminQRListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedQR, setSelectedQR] = useState<AdminQRListItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const fetchQRCodes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await qrService.getAllAdminQR();
      if (response.success && response.data) {
        setQrCodes(response.data as AdminQRListItem[]);
      } else {
        setError(response.message || "Failed to fetch QR codes");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching QR codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredQRCodes = qrCodes.filter((qr) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      qr.qrString?.toLowerCase().includes(query) ||
      qr.qrUrl?.toLowerCase().includes(query) ||
      qr._id?.toLowerCase().includes(query) ||
      qr.tableNumber?.toLowerCase().includes(query)
    );
  });

  const paginatedQRCodes = filteredQRCodes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const handleRowClick = (qr: AdminQRListItem) => {
    setSelectedQR(qr);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQR(null);
  };

  const handleDownloadQR = () => {
    if (selectedQR?.qrImageUrl) {
      const link = document.createElement("a");
      link.href = selectedQR.qrImageUrl;
      link.download = `qr-code-${selectedQR.tableNumber || selectedQR._id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "QR", href: "/qr" },
          { label: "List All QR Codes" },
        ]}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            All QR Codes
          </Typography>
          <TextField
            size="small"
            placeholder="Search QR codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>QR ID</TableCell>
                    <TableCell>QR String</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Table Number</TableCell>
                    <TableCell>Order Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Scans</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedQRCodes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 4 }}
                        >
                          No QR codes found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedQRCodes.map((qr) => (
                      <TableRow
                        key={qr._id}
                        hover
                        onClick={() => handleRowClick(qr)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <QrCodeIcon fontSize="small" color="action" />
                            <Typography variant="body2">{qr._id}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace" }}
                          >
                            {qr.qrString}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {qr.qrUrl}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(qr.qrUrl);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>{qr.tableNumber || "-"}</TableCell>
                        <TableCell>
                          {qr.orderType ? (
                            <Chip
                              label={qr.orderType}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={qr.isActive ? "Active" : "Inactive"}
                            size="small"
                            color={qr.isActive ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>{qr.scannedCount || 0}</TableCell>
                        <TableCell>{formatDate(qr.createdAt)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(qr);
                            }}
                            title="View QR Code"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredQRCodes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* QR Code Preview Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0.5 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">QR Code Details</Typography>
            {selectedQR?.tableNumber && (
              <Typography variant="body2" color="text.secondary">
                Table: {selectedQR.tableNumber}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedQR && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* QR Image */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <img
                  src={selectedQR.qrImageUrl}
                  alt="QR Code"
                  style={{ width: 250, height: 250, objectFit: "contain" }}
                />
              </Box>

              {/* QR Details */}
              <Box sx={{ width: "100%", mt: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    QR ID:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {selectedQR._id}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    QR String:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
                  >
                    {selectedQR.qrString}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    URL:
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                    {selectedQR.qrUrl}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Order Type:
                  </Typography>
                  <Typography variant="body2">
                    {selectedQR.orderType || "-"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip
                    label={selectedQR.isActive ? "Active" : "Inactive"}
                    size="small"
                    color={selectedQR.isActive ? "success" : "default"}
                  />

                  <Typography variant="body2" color="text.secondary">
                    Scans:
                  </Typography>
                  <Typography variant="body2">
                    {selectedQR.scannedCount || 0}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Created:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(selectedQR.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => copyToClipboard(selectedQR?.qrUrl || "")}
          >
            Copy URL
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadQR}
          >
            Download QR
          </Button>
        </DialogActions>
      </Dialog>

      <PageFooter backHref="/qr" backText="Back to QR Management" />
    </Box>
  );
}
