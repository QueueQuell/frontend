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
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { organisationService } from "@/lib/api/services/organisation.service";
import { Organisation } from "@/lib/api/types";

export default function OrganisationListPage() {
  const router = useRouter();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organisationToDelete, setOrganisationToDelete] =
    useState<Organisation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      setLoading(true);
      const response = await organisationService.getOrganisations();
      console.log("API Response:", response);
      if (response.success && response.data) {
        // Handle both response formats: { data: [...] } or { data: [...], total, page, limit }
        const orgData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setOrganisations(orgData);
      } else {
        setError(response.message || "Failed to fetch organisations");
      }
    } catch (err) {
      setError("Failed to fetch organisations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (org: Organisation) => {
    setOrganisationToDelete(org);
    setDeleteDialogOpen(true);
    setDeleteSuccess(false);
  };

  const handleDeleteConfirm = async () => {
    if (!organisationToDelete) return;

    try {
      setDeleting(true);
      const response = await organisationService.deleteOrganisation(
        organisationToDelete._id,
      );

      if (response.success) {
        setDeleteSuccess(true);
        // Refresh the list after successful delete
        setTimeout(() => {
          fetchOrganisations();
          setDeleteDialogOpen(false);
          setOrganisationToDelete(null);
        }, 1500);
      } else {
        setError(response.message || "Failed to delete organisation");
        setDeleteDialogOpen(false);
      }
    } catch (err) {
      setError("Failed to delete organisation");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOrganisationToDelete(null);
    setDeleteSuccess(false);
  };

  const formatDate = (dateString: string) => {
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

  const filteredOrganisations = organisations.filter(
    (org) =>
      org.organisationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchOrganisations} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Administrator", href: "/administrator" },
            {
              label: "Organisations",
              href: "/administrator/organisations/list",
            },
            { label: "List" },
          ]}
        />
        <Button
          component={Link}
          href="/administrator/organisations/create"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Organisation
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <BusinessIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Organisations
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search organisations by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Organisation Name</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrganisations.map((org) => (
              <TableRow key={org._id}>
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
                <TableCell>
                  <IconButton
                    component={Link}
                    href={`/administrator/organisations/${org._id}`}
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    color="primary"
                    href={`/administrator/organisations/${org._id}/edit`}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(org)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredOrganisations.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {searchTerm
              ? `No organisations found matching "${searchTerm}"`
              : "No organisations found"}
          </Typography>
        </Box>
      )}

      <PageFooter backHref="/administrator" backText="Back to Administrator" />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Organisation</DialogTitle>
        <DialogContent>
          {deleteSuccess ? (
            <Alert severity="success">Organisation deleted successfully!</Alert>
          ) : (
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete{" "}
              <strong>{organisationToDelete?.organisationName}</strong>? This
              action cannot be undone.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            disabled={deleting || deleteSuccess}
          >
            {deleteSuccess ? "Close" : "Cancel"}
          </Button>
          {!deleteSuccess && (
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              autoFocus
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
