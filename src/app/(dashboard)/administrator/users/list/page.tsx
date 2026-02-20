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
} from "@mui/material";
import Link from "next/link";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import {
  userService,
  AdminUser,
  AdminUserListResponse,
} from "@/lib/api/services/user.service";

export default function UserListPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAdminUsers({ page, limit });

      if (response.success && response.data) {
        setUsers(response.data.data || []);
        setTotal(response.data.total || 0);
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
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
      case "SUPER_ADMIN":
        return "error";
      case "ADMIN":
        return "warning";
      case "OWNER":
        return "info";
      case "MANAGER":
        return "primary";
      case "CHEF":
        return "success";
      case "WAITER":
        return "info";
      case "DELIVERY_PERSONNEL":
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
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
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
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No users found
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
    </Box>
  );
}
