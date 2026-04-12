"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { RegisterRequest } from "@/lib/api/services/user.service";
import { adminService } from "@/lib/api/services/admin.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserCreate, ApiError } from "@/lib/api/types";
import { useState } from "react";

const USER_ROLES = [
  { value: "User", label: "User" },
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "SuperAdmin", label: "Super Admin" },
  { value: "DeliveryPersonnel", label: "Delivery Personnel" },
  { value: "Chef", label: "Chef" },
  { value: "Waiter", label: "Waiter" },
  { value: "Staff", label: "Staff" },
  { value: "Owner", label: "Owner" },
];

interface FieldError {
  field: string;
  message: string;
}

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    title: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "User",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (fieldErrors[field as string]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
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
      const fullName =
        `${formData.firstName} ${formData.lastName || ""}`.trim();
      const response = await adminService.createUser({
        email: formData.email,
        password: formData.password,
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName,
        phone: formData.phone || "",
        role: formData.role,
      } as UserCreate);

      if (response.success) {
        setSuccess(true);
        router.push("/administrator/users");
        setFormData({
          email: "",
          password: "",
          title: "",
          firstName: "",
          lastName: "",
          phone: "",
          role: "User",
        });
      } else {
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
      const errorData = err as ApiError;
      if (errorData.status === 403) {
        if (errorData.message?.includes("limit")) {
          setError("User creation limit reached for this organisation");
        } else {
          setError("Access denied: Insufficient permissions to create user");
        }
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
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
            { label: "Users", href: "/administrator/users" },
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
          href="/administrator/users"
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
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                error={!!fieldErrors.password}
                helperText={
                  fieldErrors.password ||
                  "Must contain uppercase, lowercase, and special character"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={!!fieldErrors.title}
                helperText={fieldErrors.title}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!fieldErrors.role}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role-select"
                  value={formData.role || "User"}
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
              href="/administrator/users"
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

      <PageFooter backHref="/administrator/users" backText="Back to Users" />
    </Box>
  );
}
