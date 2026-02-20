"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { RegisterRequest, userService } from "@/lib/api/services/user.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const USER_ROLES = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "DELIVERY_PERSONNEL", label: "Delivery Personnel" },
  { value: "CHEF", label: "Chef" },
  { value: "WAITER", label: "Waiter" },
  { value: "STAFF", label: "Staff" },
];

interface FieldError {
  field: string;
  message: string;
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: FieldError[];
}

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    organisationId: "",
    role: "USER",
  });

  const handleChange = (field: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      setLoading(true);

      const response = await userService.register(formData);

      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          organisationId: "",
          role: "USER",
        });
      } else {
        // Handle validation errors from successful response
        if (response.errors && Array.isArray(response.errors)) {
          const errors: Record<string, string> = {};
          (response.errors as FieldError[]).forEach((err) => {
            errors[err.field] = err.message;
          });
          setFieldErrors(errors);
          setError(response.message || "Validation failed");
        } else {
          setError(response.message || "Failed to create user");
        }
      }
    } catch (err: any) {
      // Handle error response with errors array
      const errorData = err as ApiError;
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const errors: Record<string, string> = {};
        (errorData.errors as FieldError[]).forEach((error: FieldError) => {
          errors[error.field] = error.message;
        });
        setFieldErrors(errors);
        setError(errorData.message || "Validation failed");
      } else {
        setError(err.message || "Failed to create user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Administrator", href: "/administrator" },
            { label: "Users", href: "/administrator/users/list" },
            { label: "Create User" },
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
            Create User
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/administrator/users/list"
          startIcon={<ArrowBackIcon />}
        >
          Back to List
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          User created successfully!
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
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
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
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                error={!!fieldErrors.password}
                helperText={
                  fieldErrors.password ||
                  "Must contain uppercase, lowercase, and special character"
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Organisation ID"
                value={formData.organisationId}
                onChange={(e) => handleChange("organisationId", e.target.value)}
                required
                placeholder="e.g., OR000001"
                error={!!fieldErrors.organisationId}
                helperText={fieldErrors.organisationId}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!fieldErrors.role}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role-select"
                  value={formData.role || "USER"}
                  label="Role"
                  onChange={(e) => handleChange("role", e.target.value)}
                >
                  {USER_ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              component={Link}
              href="/administrator/users/list"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
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
