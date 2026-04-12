"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { adminService } from "@/lib/api/services/admin.service";
import type { User } from "@/lib/api/types";

export default function ViewUserPage() {
  const params = useParams();
  const id = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUser(id);

      if (response && response.data) {
        setUser(response.data as User);
      } else {
        setError(response?.message || "Failed to fetch user");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  if (error || !user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || "User not found"}</Typography>
        <Button
          component={Link}
          href="/administrator/users/list"
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Administrator", href: "/administrator" },
            { label: "Users", href: "/administrator/users/list" },
            { label: user.fullName },
          ]}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PeopleIcon sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            User Details
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            href="/administrator/users/list"
            startIcon={<ArrowBackIcon />}
          >
            Back to List
          </Button>
          <Button
            component={Link}
            href={`/administrator/users/${id}/edit`}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Full Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user.fullName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon color="action" />
              <Typography variant="body1">{user.email}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Role
            </Typography>
            <Chip
              label={user.role.replace(/_/g, " ")}
              color={getRoleColor(user.role)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Organisation ID
            </Typography>
            <Typography variant="body1">{user.organisationId}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={user.status}
              color={getStatusColor(user.status)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {formatDate(user.createdAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <PageFooter
        backHref="/administrator/users/list"
        backText="Back to Users"
      />
    </Box>
  );
}
