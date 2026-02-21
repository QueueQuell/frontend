"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { organisationService } from "@/lib/api/services/organisation.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
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

export default function CreateOrganisationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<{
    organisationName: string;
    displayName: string;
    primaryPhone: string;
    email: string;
    type: "company" | "branch";
    parentOrgId: string;
    address: {
      line1: string;
      city: string;
      state: string;
      country: string;
    };
  }>({
    organisationName: "",
    displayName: "",
    primaryPhone: "",
    email: "",
    type: "company",
    parentOrgId: "",
    address: {
      line1: "",
      city: "",
      state: "",
      country: "India",
    },
  });

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.replace("address.", "");
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);

      const payload = {
        organisationName: formData.organisationName,
        displayName: formData.displayName,
        primaryPhone: formData.primaryPhone,
        email: formData.email,
        type: formData.type as "company" | "branch",
        parentOrgId: formData.parentOrgId || null,
        address: formData.address,
      };

      const response = await organisationService.createOrganisation(payload);

      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          organisationName: "",
          displayName: "",
          primaryPhone: "",
          email: "",
          type: "company",
          parentOrgId: "",
          address: {
            line1: "",
            city: "",
            state: "",
            country: "India",
          },
        });
      } else {
        setError(response.message || "Failed to create organisation");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create organisation");
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
            {
              label: "Organisations",
              href: "/administrator/organisations/list",
            },
            { label: "Create Organisation" },
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
          <BusinessIcon sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Create Organisation
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/administrator/organisations/list"
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
          Organisation created successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Organisation Details
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Organisation Name"
                value={formData.organisationName}
                onChange={(e) =>
                  handleChange("organisationName", e.target.value)
                }
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Display Name"
                value={formData.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.primaryPhone}
                onChange={(e) => handleChange("primaryPhone", e.target.value)}
                required
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
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => handleChange("type", e.target.value)}
                >
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="branch">Branch</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.type === "branch" && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Parent Organisation ID"
                  value={formData.parentOrgId}
                  onChange={(e) => handleChange("parentOrgId", e.target.value)}
                  placeholder="e.g., OR000001"
                />
              </Grid>
            )}
          </Grid>

          <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>
            Address Details
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={formData.address.line1}
                onChange={(e) => handleChange("address.line1", e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="City"
                value={formData.address.city}
                onChange={(e) => handleChange("address.city", e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="State"
                value={formData.address.state}
                onChange={(e) => handleChange("address.state", e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Country"
                value={formData.address.country}
                onChange={(e) =>
                  handleChange("address.country", e.target.value)
                }
                required
              />
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              component={Link}
              href="/administrator/organisations/list"
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
              {loading ? "Creating..." : "Create Organisation"}
            </Button>
          </Box>
        </Paper>
      </form>

      <PageFooter
        backHref="/administrator/organisations/list"
        backText="Back to Organisations"
      />
    </Box>
  );
}
