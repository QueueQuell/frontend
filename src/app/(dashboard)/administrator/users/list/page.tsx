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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { adminService } from "@/lib/api/services/admin.service";
import type { User } from "@/lib/api/types";

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<
    | {
        open: false;
      }
    | {
        open: true;
        userId: string;
        userName: string;
      }
  >({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(10);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.listUsers({ page, limit });

      if (response) {
        const usersData = response.data || [];
        const pagination = response.pagination;
        setUsers(usersData);
        setTotal(pagination?.total || 0);
        setPage(pagination?.page || 1);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpen = (userId: string, userName: string) => {
    setDeleteDialog({ open: true, userId, userName });
  };

  const handleDeleteClose = () => {
    setDeleteDialog({ open: false });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.open && deleteDialog.userId) {
      try {
        setDeleting(true);
        await adminService.deleteUser(deleteDialog.userId);
        setSnackbar({
          open: true,
          message: "User deleted successfully",
          severity: "success",
        });
        fetchUsers(); // Refetch to update list
        handleDeleteClose();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to delete user",
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

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return "error";
      case "Admin":
        return "warning";
      case "Owner":
        return "info";
      case "Manager":
        return "primary";
      case "Chef":
        return "success";
      case "Waiter":
        return "info";
      case "DeliveryPersonnel":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "success" : "default";
  };

  if (loading && users.length === 0) {
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
        <Button onClick={fetchUsers} sx={{ mt: 2 }}>
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
            { label: "Users", href: "/administrator/users/list" },
            { label: "List" },
          ]}
        />
        <Button
          component={Link}
          href="/administrator/users/create"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <PeopleIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Users
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({total} total)
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users by name or email..."
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
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Organisation ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role.replace(/_/g, " ")}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.organisationId}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={getStatusColor(user.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    href={`/administrator/users/${user.id}`}
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    color="primary"
                    href={`/administrator/users/${user.id}/edit`}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteOpen(user.id, user.fullName)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {searchTerm
              ? `No users found matching "${searchTerm}"`
              : "No users found"}
          </Typography>
        </Box>
      )}

      {total > limit && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            variant="outlined"
          >
            Previous
          </Button>
          <Typography sx={{ display: "flex", alignItems: "center", px: 2 }}>
            Page {page} of {Math.ceil(total / limit)}
          </Typography>
          <Button
            disabled={page * limit >= total}
            onClick={() => setPage(page + 1)}
            variant="outlined"
          >
            Next
          </Button>
        </Box>
      )}

      <PageFooter backHref="/administrator" backText="Back to Administrator" />

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
            {deleteDialog.open ? deleteDialog.userName : ""}"? This action
            cannot be undone.
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

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
