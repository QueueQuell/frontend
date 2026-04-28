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
  Chip,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import BusinessIcon from "@mui/icons-material/Business";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { organisationService } from "@/lib/api/services/organisation.service";
import { Organisation } from "@/lib/api/types";

export default function EditOrganisationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userOrgId, setUserOrgId] = useState<string>("");

  // Check user role and organisation on mount
  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const user = JSON.parse(userDetails);
      const superAdminRoles = ["SuperAdmin"];
      const userRole = user.role?.toUpperCase() || "";
      const isSuper = superAdminRoles.some((role) =>
        userRole.includes(role.toUpperCase()),
      );
      setIsSuperAdmin(isSuper);

      // Get user's current organisation ID
      setUserOrgId(user.organisationId);
    }
  }, []);

  const [formData, setFormData] = useState({
    organisationName: "",
    displayName: "",
    tagLine: "",
    logo: "",
    customDomain: "",
    type: "company" as "company" | "branch",
    tier: "basic" as "basic" | "pro" | "enterprise",
    parentOrgId: "",
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
    secondaryEmail: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
    },
    paymentDetails: {
      upiId: "",
      merchantId: "",
      merchantName: "",
      enabledMethods: [] as string[],
    },
    configurations: {
      business: {
        taxPercentage: 5,
        taxLabel: "GST",
        currency: "INR",
        currencySymbol: "₹",
        packagingCharge: 0,
        deliveryCharge: 0,
        freeDeliveryAbove: 0,
        minOrderAmount: 0,
      },
      timing: {
        openTime: "09:00",
        closeTime: "23:00",
        timezone: "Asia/Kolkata",
        weeklyOff: [] as string[],
      },
      features: {
        videoMenuEnabled: false,
        multiLanguageEnabled: false,
        ratingEnabled: true,
        reviewsEnabled: true,
        loyaltyEnabled: false,
        tableOrderingEnabled: false,
        takeawayEnabled: true,
        deliveryEnabled: true,
      },
      limits: {
        maxUsers: 10,
        maxQRs: 5,
        maxBranches: 3,
      },
    },
  });

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
        const org = response.data as Organisation;
        setOrganisation(org);

        // Populate form with existing data
        // For non-super admins editing a branch, auto-set parentOrgId to their current org
        const parentOrgId =
          !isSuperAdmin && org.type === "branch"
            ? userOrgId
            : org.parentOrgId || "";

        setFormData({
          organisationName: org.organisationName || "",
          displayName: org.displayName || "",
          tagLine: org.tagLine || "",
          logo: org.logo || "",
          customDomain: org.customDomain || "",
          type: org.type || "company",
          tier: org.tier || "basic",
          parentOrgId: parentOrgId,
          primaryPhone: org.primaryPhone || "",
          secondaryPhone: org.secondaryPhone || "",
          email: org.email || "",
          secondaryEmail: org.secondaryEmail || "",
          address: {
            line1: org.address?.line1 || "",
            line2: org.address?.line2 || "",
            city: org.address?.city || "",
            state: org.address?.state || "",
            pinCode: org.address?.pinCode || "",
            country: org.address?.country || "India",
          },
          paymentDetails: {
            upiId: org.paymentDetails?.upiId || "",
            merchantId: org.paymentDetails?.merchantId || "",
            merchantName: org.paymentDetails?.merchantName || "",
            enabledMethods: org.paymentDetails?.enabledMethods || [],
          },
          configurations: {
            business: {
              taxPercentage: org.configurations?.business?.taxPercentage || 18,
              taxLabel: org.configurations?.business?.taxLabel || "GST",
              currency: org.configurations?.business?.currency || "INR",
              currencySymbol:
                org.configurations?.business?.currencySymbol || "₹",
              packagingCharge:
                org.configurations?.business?.packagingCharge || 0,
              deliveryCharge: org.configurations?.business?.deliveryCharge || 0,
              freeDeliveryAbove:
                org.configurations?.business?.freeDeliveryAbove || 0,
              minOrderAmount: org.configurations?.business?.minOrderAmount || 0,
            },
            timing: {
              openTime: org.configurations?.timing?.openTime || "09:00",
              closeTime: org.configurations?.timing?.closeTime || "23:00",
              timezone: org.configurations?.timing?.timezone || "Asia/Kolkata",
              weeklyOff: org.configurations?.timing?.weeklyOff || [],
            },
            features: {
              videoMenuEnabled:
                org.configurations?.features?.videoMenuEnabled || false,
              multiLanguageEnabled:
                org.configurations?.features?.multiLanguageEnabled || false,
              ratingEnabled:
                org.configurations?.features?.ratingEnabled ?? true,
              reviewsEnabled:
                org.configurations?.features?.reviewsEnabled ?? true,
              loyaltyEnabled:
                org.configurations?.features?.loyaltyEnabled || false,
              tableOrderingEnabled:
                org.configurations?.features?.tableOrderingEnabled || false,
              takeawayEnabled:
                org.configurations?.features?.takeawayEnabled ?? true,
              deliveryEnabled:
                org.configurations?.features?.deliveryEnabled ?? true,
            },
            limits: {
              maxUsers: org.configurations?.limits?.maxUsers || 10,
              maxQRs: org.configurations?.limits?.maxQRs || 5,
              maxBranches: org.configurations?.limits?.maxBranches || 3,
            },
          },
        });
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

  const handleChange = (field: string, value: any) => {
    if (field.startsWith("address.")) {
      const addressField = field.replace("address.", "");
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (field.startsWith("paymentDetails.")) {
      const paymentField = field.replace("paymentDetails.", "");
      setFormData((prev) => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          [paymentField]: value,
        },
      }));
    } else if (field.startsWith("configurations.business.")) {
      const businessField = field.replace("configurations.business.", "");
      setFormData((prev) => ({
        ...prev,
        configurations: {
          ...prev.configurations,
          business: {
            ...prev.configurations.business,
            [businessField]: value,
          },
        },
      }));
    } else if (field.startsWith("configurations.timing.")) {
      const timingField = field.replace("configurations.timing.", "");
      setFormData((prev) => ({
        ...prev,
        configurations: {
          ...prev.configurations,
          timing: {
            ...prev.configurations.timing,
            [timingField]: value,
          },
        },
      }));
    } else if (field.startsWith("configurations.features.")) {
      const featureField = field.replace("configurations.features.", "");
      setFormData((prev) => ({
        ...prev,
        configurations: {
          ...prev.configurations,
          features: {
            ...prev.configurations.features,
            [featureField]: value,
          },
        },
      }));
    } else if (field.startsWith("configurations.limits.")) {
      const limitField = field.replace("configurations.limits.", "");
      setFormData((prev) => ({
        ...prev,
        configurations: {
          ...prev.configurations,
          limits: {
            ...prev.configurations.limits,
            [limitField]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleMethodToggle = (method: string) => {
    const currentMethods = formData.paymentDetails.enabledMethods;
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter((m) => m !== method)
      : [...currentMethods, method];
    handleChange("paymentDetails.enabledMethods", newMethods);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);

      // For non-super admins with branch type, auto-set parentOrgId to their current org
      const parentOrgId =
        !isSuperAdmin && formData.type === "branch"
          ? userOrgId
          : formData.parentOrgId;

      const payload = {
        organisationName: formData.organisationName,
        displayName: formData.displayName,
        tagLine: formData.tagLine || undefined,
        logo: formData.logo || undefined,
        customDomain: formData.customDomain || undefined,
        type: formData.type,
        tier: formData.tier,
        parentOrgId: parentOrgId,
        primaryPhone: formData.primaryPhone || undefined,
        secondaryPhone: formData.secondaryPhone || undefined,
        email: formData.email || undefined,
        secondaryEmail: formData.secondaryEmail || undefined,
        address: formData.address,
        paymentDetails:
          formData.paymentDetails.enabledMethods.length > 0
            ? {
                ...formData.paymentDetails,
                enabledMethods: formData.paymentDetails.enabledMethods,
              }
            : undefined,
        configurations: {
          business: formData.configurations.business,
          timing: formData.configurations.timing,
          features: formData.configurations.features,
          limits: isSuperAdmin ? formData.configurations.limits : undefined,
        },
      };

      const response = await organisationService.updateOrganisation(
        id,
        payload,
      );

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/administrator/organisations/${id}`);
        }, 1500);
      } else {
        setError(response.message || "Failed to update organisation");
      }
    } catch (err: any) {
      if (err.status === 403) {
        if (err.message?.includes("tier") || err.message?.includes("limit")) {
          setError(
            "Access denied: Only SuperAdmin can update organisation tier or limits",
          );
        } else {
          setError(
            "Access denied: Insufficient permissions to perform this action",
          );
        }
      } else {
        setError(err.message || "Failed to update organisation");
      }
    } finally {
      setSaving(false);
    }
  };

  const paymentMethods = ["cash", "upi", "card", "wallet", "online"];
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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

  if (error && !organisation) {
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
            {
              label: organisation?.organisationName || "Edit",
              href: `/administrator/organisations/${id}`,
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
          <BusinessIcon sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Edit Organisation
          </Typography>
        </Box>
        <Button
          component={Link}
          href={`/administrator/organisations/${id}`}
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
          Organisation updated successfully! Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
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
                label="Tag Line"
                value={formData.tagLine}
                onChange={(e) => handleChange("tagLine", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Logo URL"
                value={formData.logo}
                onChange={(e) => handleChange("logo", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Custom Domain"
                value={formData.customDomain}
                onChange={(e) => handleChange("customDomain", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {isSuperAdmin ? (
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
              ) : (
                <TextField
                  fullWidth
                  label="Type"
                  value={formData.type === "company" ? "Company" : "Branch"}
                  disabled
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {isSuperAdmin ? (
                <FormControl fullWidth>
                  <InputLabel>Tier</InputLabel>
                  <Select
                    value={formData.tier}
                    label="Tier"
                    onChange={(e) => handleChange("tier", e.target.value)}
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="pro">Pro</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="Tier"
                  value={
                    formData.tier.charAt(0).toUpperCase() +
                    formData.tier.slice(1)
                  }
                  disabled
                />
              )}
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
              <TextField
                fullWidth
                label="Primary Phone"
                value={formData.primaryPhone}
                onChange={(e) => handleChange("primaryPhone", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Secondary Phone"
                value={formData.secondaryPhone}
                onChange={(e) => handleChange("secondaryPhone", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Secondary Email"
                type="email"
                value={formData.secondaryEmail}
                onChange={(e) => handleChange("secondaryEmail", e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Address */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Address
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={formData.address.line1}
                onChange={(e) => handleChange("address.line1", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address Line 2"
                value={formData.address.line2}
                onChange={(e) => handleChange("address.line2", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="City"
                value={formData.address.city}
                onChange={(e) => handleChange("address.city", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="State"
                value={formData.address.state}
                onChange={(e) => handleChange("address.state", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Pin Code"
                value={formData.address.pinCode}
                onChange={(e) =>
                  handleChange("address.pinCode", e.target.value)
                }
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
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Payment Details - Only visible to Super Admin */}
        {isSuperAdmin && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Payment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="UPI ID"
                  value={formData.paymentDetails.upiId}
                  onChange={(e) =>
                    handleChange("paymentDetails.upiId", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Merchant ID"
                  value={formData.paymentDetails.merchantId}
                  onChange={(e) =>
                    handleChange("paymentDetails.merchantId", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Merchant Name"
                  value={formData.paymentDetails.merchantName}
                  onChange={(e) =>
                    handleChange("paymentDetails.merchantName", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Enabled Payment Methods
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {paymentMethods.map((method) => (
                    <Chip
                      key={method}
                      label={method}
                      onClick={() => handleMethodToggle(method)}
                      color={
                        formData.paymentDetails.enabledMethods.includes(method)
                          ? "primary"
                          : "default"
                      }
                      variant={
                        formData.paymentDetails.enabledMethods.includes(method)
                          ? "filled"
                          : "outlined"
                      }
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Business Configuration - Only visible to Super Admin */}
        {isSuperAdmin && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Business Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Tax Percentage"
                  type="number"
                  value={formData.configurations.business.taxPercentage}
                  onChange={(e) =>
                    handleChange(
                      "configurations.business.taxPercentage",
                      Number(e.target.value),
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Tax Label"
                  value={formData.configurations.business.taxLabel}
                  onChange={(e) =>
                    handleChange(
                      "configurations.business.taxLabel",
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Currency"
                  value={formData.configurations.business.currency}
                  onChange={(e) =>
                    handleChange(
                      "configurations.business.currency",
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Currency Symbol"
                  value={formData.configurations.business.currencySymbol}
                  onChange={(e) =>
                    handleChange(
                      "configurations.business.currencySymbol",
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Packaging Charge"
                  type="number"
                  value={formData.configurations.business.packagingCharge}
                  onChange={(e) =>
                    handleChange(
                      "configurations.business.packagingCharge",
                      Number(e.target.value),
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Delivery Charge"
                  type="number"
                  value={formData.configurations.business.deliveryCharge}
                  onChange={(e) =>
                    handleChange(
                      "configurations.business.deliveryCharge",
                      Number(e.target.value),
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Free Delivery Above"
                  type="number"
                  value={formData.configurations.business.freeDeliveryAbove}
                  onChange={(e) =>
                    handleChange(
                      "configurations.business.freeDeliveryAbove",
                      Number(e.target.value),
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Minimum Order Amount"
                  type="number"
                  value={formData.configurations.business.minOrderAmount}
                  onChange={(e) =>
                    handleChange(
                      "configurations.business.minOrderAmount",
                      Number(e.target.value),
                    )
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Timing - Only visible to Super Admin */}
        {isSuperAdmin && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Timing
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Timezone"
                  value={formData.configurations.timing.timezone}
                  onChange={(e) =>
                    handleChange(
                      "configurations.timing.timezone",
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Open Time"
                  type="time"
                  value={formData.configurations.timing.openTime}
                  onChange={(e) =>
                    handleChange(
                      "configurations.timing.openTime",
                      e.target.value,
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Close Time"
                  type="time"
                  value={formData.configurations.timing.closeTime}
                  onChange={(e) =>
                    handleChange(
                      "configurations.timing.closeTime",
                      e.target.value,
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Weekly Off
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {weekDays.map((day) => (
                    <Chip
                      key={day}
                      label={day}
                      onClick={() => {
                        const currentOff =
                          formData.configurations.timing.weeklyOff;
                        const newOff = currentOff.includes(day)
                          ? currentOff.filter((d) => d !== day)
                          : [...currentOff, day];
                        handleChange("configurations.timing.weeklyOff", newOff);
                      }}
                      color={
                        formData.configurations.timing.weeklyOff.includes(day)
                          ? "error"
                          : "default"
                      }
                      variant={
                        formData.configurations.timing.weeklyOff.includes(day)
                          ? "filled"
                          : "outlined"
                      }
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Features */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Features
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={formData.configurations.features.videoMenuEnabled}
                  onChange={(e) =>
                    handleChange(
                      "configurations.features.videoMenuEnabled",
                      e.target.checked,
                    )
                  }
                  disabled={!isSuperAdmin}
                />
                <Typography>Video Menu</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={
                    formData.configurations.features.multiLanguageEnabled
                  }
                  onChange={(e) =>
                    handleChange(
                      "configurations.features.multiLanguageEnabled",
                      e.target.checked,
                    )
                  }
                  disabled={!isSuperAdmin}
                />
                <Typography>Multi Language</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={formData.configurations.features.ratingEnabled}
                  onChange={(e) =>
                    handleChange(
                      "configurations.features.ratingEnabled",
                      e.target.checked,
                    )
                  }
                  disabled={!isSuperAdmin}
                />
                <Typography>Rating</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={formData.configurations.features.reviewsEnabled}
                  onChange={(e) =>
                    handleChange(
                      "configurations.features.reviewsEnabled",
                      e.target.checked,
                    )
                  }
                  disabled={!isSuperAdmin}
                />
                <Typography>Reviews</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={formData.configurations.features.loyaltyEnabled}
                  onChange={(e) =>
                    handleChange(
                      "configurations.features.loyaltyEnabled",
                      e.target.checked,
                    )
                  }
                  disabled={!isSuperAdmin}
                />
                <Typography>Loyalty</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={
                    formData.configurations.features.tableOrderingEnabled
                  }
                  onChange={(e) =>
                    handleChange(
                      "configurations.features.tableOrderingEnabled",
                      e.target.checked,
                    )
                  }
                  disabled={!isSuperAdmin}
                />
                <Typography>Table Ordering</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={formData.configurations.features.takeawayEnabled}
                  onChange={(e) =>
                    handleChange(
                      "configurations.features.takeawayEnabled",
                      e.target.checked,
                    )
                  }
                  disabled={!isSuperAdmin}
                />
                <Typography>Takeaway</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Switch
                  checked={formData.configurations.features.deliveryEnabled}
                  onChange={(e) =>
                    handleChange(
                      "configurations.features.deliveryEnabled",
                      e.target.checked,
                    )
                  }
                  disabled={!isSuperAdmin}
                />
                <Typography>Delivery</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Limits Configuration - SuperAdmin Only */}
        {isSuperAdmin && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Limits Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Max Users"
                  type="number"
                  value={formData.configurations.limits?.maxUsers}
                  onChange={(e) =>
                    handleChange(
                      "configurations.limits.maxUsers",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Max QRs"
                  type="number"
                  value={formData.configurations.limits?.maxQRs}
                  onChange={(e) =>
                    handleChange(
                      "configurations.limits.maxQRs",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Max Branches"
                  type="number"
                  value={formData.configurations.limits?.maxBranches}
                  onChange={(e) =>
                    handleChange(
                      "configurations.limits.maxBranches",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 3 }}
        >
          <Button
            component={Link}
            href={`/administrator/organisations/${id}`}
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
      </form>

      <PageFooter
        backHref="/administrator/organisations/list"
        backText="Back to Organisations"
      />
    </Box>
  );
}
