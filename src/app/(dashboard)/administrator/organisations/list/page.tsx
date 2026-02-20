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
} from "@mui/material";
import Link from "next/link";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { organisationService } from "@/lib/api/services/organisation.service";
import { Organisation } from "@/lib/api/types";

export default function OrganisationListPage() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            {organisations.map((org) => (
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
                  <Button size="small" startIcon={<EditIcon />}>
                    Edit
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {organisations.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No organisations found
          </Typography>
        </Box>
      )}

      <PageFooter backHref="/administrator" backText="Back to Administrator" />
    </Box>
  );
}
