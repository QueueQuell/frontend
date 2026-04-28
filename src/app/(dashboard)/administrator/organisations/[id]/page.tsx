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
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { organisationService } from "@/lib/api/services/organisation.service";
import { Organisation } from "@/lib/api/types";

export default function ViewOrganisationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrganisation();
    }
  }, [id]);

  const fetchOrganisation = async () => {
    try {
      setLoading(true);
      const response = await organisationService.getOrganisation(id);

      if (response.success && response.data) {
        setOrganisation(response.data as Organisation);
      } else {
        setError(response.message || "Failed to fetch organisation");
      }
    } catch (err) {
      setError("Failed to fetch organisation");
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
      hour: "2-digit",
      minute: "2-digit",
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

  if (error || !organisation) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          {error || "Organisation not found"}
        </Typography>
        <Button
          component={Link}
          href="/administrator/organisations/list"
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
            {
              label: "Organisations",
              href: "/administrator/organisations/list",
            },
            { label: organisation.organisationName },
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
            Organisation Details
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            href="/administrator/organisations/list"
            startIcon={<ArrowBackIcon />}
          >
            Back to List
          </Button>
          <Button
            component={Link}
            href={`/administrator/organisations/${id}/edit`}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Basic Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Organisation Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {organisation.organisationName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Display Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {organisation.displayName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Tag Line
            </Typography>
            <Typography variant="body1">
              {organisation.tagLine || "-"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Type
            </Typography>
            <Chip
              label={organisation.type}
              color={getTypeColor(organisation.type)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Tier
            </Typography>
            <Chip
              label={organisation.tier}
              color={
                organisation.tier === "enterprise"
                  ? "primary"
                  : organisation.tier === "pro"
                    ? "secondary"
                    : "default"
              }
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={organisation.status}
              color={getStatusColor(organisation.status)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Custom Domain
            </Typography>
            <Typography variant="body1">
              {organisation.customDomain || "-"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Contact Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Primary Phone
                </Typography>
                <Typography variant="body1">
                  {organisation.primaryPhone || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Secondary Phone
                </Typography>
                <Typography variant="body1">
                  {organisation.secondaryPhone || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {organisation.email || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Secondary Email
                </Typography>
                <Typography variant="body1">
                  {organisation.secondaryEmail || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Address Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Address
        </Typography>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <LocationOnIcon color="action" />
          <Box>
            <Typography variant="body1">
              {organisation.address?.line1}
              {organisation.address?.line2 && `, ${organisation.address.line2}`}
            </Typography>
            <Typography variant="body1">
              {organisation.address?.city}, {organisation.address?.state}{" "}
              {organisation.address?.pinCode}
            </Typography>
            <Typography variant="body1">
              {organisation.address?.country}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Payment Details */}
      {organisation.paymentDetails && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payment Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                UPI ID
              </Typography>
              <Typography variant="body1">
                {organisation.paymentDetails.upiId || "-"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Merchant ID
              </Typography>
              <Typography variant="body1">
                {organisation.paymentDetails.merchantId || "-"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Merchant Name
              </Typography>
              <Typography variant="body1">
                {organisation.paymentDetails.merchantName || "-"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Enabled Methods
              </Typography>
              <Box
                sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}
              >
                {organisation.paymentDetails.enabledMethods?.map((method) => (
                  <Chip
                    key={method}
                    label={method}
                    size="small"
                    variant="outlined"
                  />
                )) || "-"}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Business Configurations */}
      {organisation.configurations?.business && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Business Configuration
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Currency
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.business.currencySymbol}{" "}
                {organisation.configurations.business.currency}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Tax ({organisation.configurations.business.taxLabel})
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.business.taxPercentage}%
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Packaging Charge
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.business.packagingCharge}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Delivery Charge
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.business.deliveryCharge}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Free Delivery Above
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.business.freeDeliveryAbove}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Minimum Order Amount
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.business.minOrderAmount}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Timing */}
      {organisation.configurations?.timing && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Timing
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Timezone
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.timing.timezone || "-"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Open Time
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.timing.openTime || "-"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Close Time
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.timing.closeTime || "-"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Weekly Off
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {organisation.configurations.timing.weeklyOff?.map((day) => (
                  <Chip key={day} label={day} size="small" />
                )) || "-"}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Features */}
      {organisation.configurations?.features && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Features
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Chip
                label={`Video Menu: ${organisation.configurations.features.videoMenuEnabled ? "Enabled" : "Disabled"}`}
                color={
                  organisation.configurations.features.videoMenuEnabled
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Chip
                label={`Multi Language: ${organisation.configurations.features.multiLanguageEnabled ? "Enabled" : "Disabled"}`}
                color={
                  organisation.configurations.features.multiLanguageEnabled
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Chip
                label={`Rating: ${organisation.configurations.features.ratingEnabled ? "Enabled" : "Disabled"}`}
                color={
                  organisation.configurations.features.ratingEnabled
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Chip
                label={`Reviews: ${organisation.configurations.features.reviewsEnabled ? "Enabled" : "Disabled"}`}
                color={
                  organisation.configurations.features.reviewsEnabled
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Chip
                label={`Loyalty: ${organisation.configurations.features.loyaltyEnabled ? "Enabled" : "Disabled"}`}
                color={
                  organisation.configurations.features.loyaltyEnabled
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Chip
                label={`Table Ordering: ${organisation.configurations.features.tableOrderingEnabled ? "Enabled" : "Disabled"}`}
                color={
                  organisation.configurations.features.tableOrderingEnabled
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Chip
                label={`Takeaway: ${organisation.configurations.features.takeawayEnabled ? "Enabled" : "Disabled"}`}
                color={
                  organisation.configurations.features.takeawayEnabled
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Chip
                label={`Delivery: ${organisation.configurations.features.deliveryEnabled ? "Enabled" : "Disabled"}`}
                color={
                  organisation.configurations.features.deliveryEnabled
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Limits Configuration */}
      {organisation.configurations?.limits && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Limits Configuration
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Max Users
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.limits.maxUsers}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Max QRs
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.limits.maxQRs}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Max Branches
              </Typography>
              <Typography variant="body1">
                {organisation.configurations.limits.maxBranches}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Timestamps */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Record Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {formatDate(organisation.createdAt)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Updated At
            </Typography>
            <Typography variant="body1">
              {formatDate(organisation.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <PageFooter
        backHref="/administrator/organisations/list"
        backText="Back to Organisations"
      />
    </Box>
  );
}
