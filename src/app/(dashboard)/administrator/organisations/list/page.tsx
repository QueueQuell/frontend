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
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { organisationService } from "@/lib/api/services/organisation.service";
import type { Organisation } from "@/lib/api/types";
import SnackbarAlert from "@/components/ui/SnackbarAlert";

export default function OrganisationListPage() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [deleteDialog, setDeleteDialog] = useState<
    { open: false } | { open: true; orgId: string; orgName: string }
  >({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fetchOrganisations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await organisationService.getOrganisations();
      if (response.success && response.data) {
        const orgData = Array.isArray(response.data) ? response.data : [];
        setOrganisations(orgData as Organisation[]);
      } else {
        setError(response.message || "Failed to fetch organisations");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch organisations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisations();
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

  const filteredOrganisations = organisations.filter((org) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      org.organisationName.toLowerCase().includes(query) ||
      org.displayName.toLowerCase().includes(query) ||
      org.email?.toLowerCase().includes(query)
    );
  });

  const paginatedOrganisations = filteredOrganisations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleDeleteOpen = (orgId: string, orgName: string) => {
    setDeleteDialog({ open: true, orgId, orgName });
  };

  const handleDeleteClose = () => {
    setDeleteDialog({ open: false });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.open && deleteDialog.orgId) {
      try {
        setDeleting(true);
        await organisationService.deleteOrganisation(deleteDialog.orgId);
        setSnackbar({
          open: true,
          message: "Organisation deleted successfully",
          severity: "success",
        });
        fetchOrganisations();
        handleDeleteClose();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to delete organisation",
          severity: "error",
        });
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    return type === "company" ? "primary" : "secondary";
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "success" : "default";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Administrator", href: "/administrator" },
          { label: "Organisations" },
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
            Organisations ({filteredOrganisations.length} total)
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search organisations by name or email..."
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
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchOrganisations}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              component={Link}
              href="/administrator/organisations/create"
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
            >
              Add Organisation
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

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
                    <TableCell>Organisation Name</TableCell>
                    <TableCell>Display Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Tier</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedOrganisations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 4 }}
                        >
                          No organisations found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrganisations.map((org) => (
                      <TableRow key={org.id} hover>
                        <TableCell>{org.organisationName}</TableCell>
                        <TableCell>{org.displayName}</TableCell>
                        <TableCell>
                          <Chip
                            label={org.type}
                            color={getTypeColor(org.type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={org.tier}
                            color={
                              org.tier === "enterprise"
                                ? "primary"
                                : org.tier === "pro"
                                  ? "secondary"
                                  : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {org.address?.city}, {org.address?.state},{" "}
                          {org.address?.country}
                        </TableCell>
                        <TableCell>{org.primaryPhone}</TableCell>
                        <TableCell>{org.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={org.status}
                            color={getStatusColor(org.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(org.createdAt)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            component={Link}
                            href={`/administrator/organisations/${org.id}`}
                            size="small"
                            title="View"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            component={Link}
                            href={`/administrator/organisations/${org.id}/edit`}
                            color="primary"
                            size="small"
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteOpen(org.id!, org.organisationName)
                            }
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
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
              count={filteredOrganisations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "
            {deleteDialog.open ? deleteDialog.orgName : ""}"? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            autoFocus
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      <PageFooter backHref="/administrator" backText="Back to Administrator" />
    </Box>
  );
}
