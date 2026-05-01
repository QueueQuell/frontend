"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Grid,
  Alert,
  Chip,
} from "@mui/material";
import { organisationService } from "@/lib/api/services/organisation.service";
import { Organisation } from "@/lib/api/types";

interface LimitItem {
  label: string;
  current: number;
  max: number;
  unit?: string;
}

export default function OrganisationLimits() {
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganisationLimits();
  }, []);

  const fetchOrganisationLimits = async () => {
    try {
      setLoading(true);
      // Get current user's organisation
      const userDetails = localStorage.getItem("userDetails");
      if (!userDetails) {
        setError("User not authenticated");
        return;
      }

      const user = JSON.parse(userDetails);
      const orgId = user.org?.id;

      if (!orgId) {
        setError("No organisation found");
        return;
      }

      const response = await organisationService.getOrganisation(orgId);
      if (response.success && response.data) {
        setOrganisation(response.data as Organisation);
      } else {
        setError(response.message || "Failed to fetch organisation limits");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch organisation limits");
    } finally {
      setLoading(false);
    }
  };

  const getLimitsData = (): LimitItem[] => {
    if (!organisation?.configurations?.limits) return [];

    const limits = organisation.configurations.limits;
    // For now, we'll show static current values. In a real app, you'd fetch actual usage counts
    return [
      { label: "Users", current: 5, max: limits.maxUsers, unit: "" },
      { label: "QRs", current: 3, max: limits.maxQRs, unit: "" },
      { label: "Branches", current: 2, max: limits.maxBranches, unit: "" },
    ];
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "error";
    if (percentage >= 80) return "warning";
    return "success";
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "enterprise":
        return "primary";
      case "pro":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Organisation Limits
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Typography>Loading...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Organisation Limits
          </Typography>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!organisation?.configurations?.limits) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Organisation Limits
          </Typography>
          <Alert severity="info">
            No limits configured for this organisation.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const limitsData = getLimitsData();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6">Organisation Limits</Typography>
          <Chip
            label={
              organisation.tier.charAt(0).toUpperCase() +
              organisation.tier.slice(1)
            }
            color={getTierColor(organisation.tier)}
            size="small"
          />
        </Box>

        <Grid container spacing={2}>
          {limitsData.map((limit, index) => {
            const percentage = (limit.current / limit.max) * 100;
            const progressColor = getProgressColor(percentage);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {limit.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {limit.current}
                      {limit.unit}/{limit.max}
                      {limit.unit}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(percentage, 100)}
                    color={progressColor}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  {percentage >= 80 && (
                    <Typography
                      variant="caption"
                      color={`${progressColor}.main`}
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {percentage >= 90 ? "Critical" : "Warning"}:{" "}
                      {percentage.toFixed(1)}% used
                    </Typography>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
