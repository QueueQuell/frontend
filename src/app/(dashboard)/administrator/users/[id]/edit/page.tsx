"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import PeopleIcon from "@mui/icons-material/People";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { adminService } from "@/lib/api/services/admin.service";
import type { User } from "@/lib/api/types";

const USER_ROLES = [
  { value: "SuperAdmin", label: "Super Admin" },
  { value: "Admin", label: "Admin" },
  { value: "Owner", label: "Owner" },
  { value: "Manager", label: "Manager" },
  { value: "Chef", label: "Chef" },
  { value: "Waiter", label: "Waiter" },
  { value: "DeliveryPersonnel", label: "Delivery Personnel" },
];

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "" as string,
    organisationId: "",
    status: "" as string,
  });

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
        const fetchedUser = response.data as User;
        setUser(fetchedUser);
        setFormData({
          fullName: fetchedUser.fullName || "",
          email: fetchedUser.email || "",
          role: fetchedUser.role || "",
          organisationId: fetchedUser.organisationId || "",
          status: fetchedUser.status || "active",
        });
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof typeof fieldErrors];
        return newErrors;
      });
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      setSaving(true);
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        organisationId: formData.organisationId || undefined,
        status: formData.status,
      };

      const response = await adminService.updateUser(id!, payload);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/administrator/users/${id}`);
        }, 1500);
      } else {
        setError(response.message || "Failed to update user");
        if (response.errors) {
          const errors: Record<string, string> = {};
          response.errors.forEach((err: any) => {
            errors[err.field] = err.message;
          });
          setFieldErrors(errors);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
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

  if (error && !user) {
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
            {
              label: user?.fullName || "Edit User",
              href: `/administrator/users/${id}`,
            },
            { label: "Edit" },
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
            Edit User
          </Typography>
        </Box>
        <Button
          component={Link}
          href={`/administrator/users/${id}`}
          startIcon={<ArrowBackIcon />}
        >
          Cancel
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          User updated successfully! Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            User Details
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
                error={!!fieldErrors.fullName}
                helperText={fieldErrors.fullName}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Organisation ID"
                value={formData.organisationId}
                onChange={(e) => handleChange("organisationId", e.target.value)}
                error={!!fieldErrors.organisationId}
                helperText={fieldErrors.organisationId}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!fieldErrors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) =>
                    handleChange("role", e.target.value as string)
                  }
                >
                  {USER_ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!fieldErrors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    handleChange("status", e.target.value as string)
                  }
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              component={Link}
              href={`/administrator/users/${id}`}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      </form>

      <PageFooter
        backHref="/administrator/users/list"
        backText="Back to Users"
      />
    </Box>
  );
}
