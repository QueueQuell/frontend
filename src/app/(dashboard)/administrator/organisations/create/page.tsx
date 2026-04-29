"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { organisationService } from "@/lib/api/services/organisation.service";
import {
  isSuperAdmin,
  getRoleDisplayName,
  UserRole,
} from "@/lib/utils/accessControl";
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
  Chip,
  Switch,
} from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FieldError {
  field: string;
  message: string;
}

export default function CreateOrganisationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [isSuperAdminRole, setIsSuperAdminRole] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  const validateField = (field: string, value: any, type?: string): string => {
    const trimmed = (value || "").toString().trim();

    switch (field) {
      case "organisationName":
        if (!trimmed) return "Organisation name is required";
        if (trimmed.length > 200)
          return "Organisation name cannot exceed 200 characters";
        return "";
      case "address.line1":
        return !trimmed ? "Address line 1 is required" : "";
      case "address.city":
        return !trimmed ? "City is required" : "";
      case "address.state":
        return !trimmed ? "State is required" : "";
      case "address.country":
        return !trimmed ? "Country is required" : "";
      case "primaryPhone":
        if (!trimmed) return "Enter valid phone number";
        if (!/^\\+?[1-9]\\d{1,14}$/.test(trimmed))
          return "Please provide a valid phone number";
        return "";
      case "email":
        if (!trimmed) return "Please provide a valid email";
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(trimmed))
          return "Please provide a valid email";
        return "";
      case "type":
        return !["company", "branch"].includes(trimmed)
          ? 'Organisation type must be "company" or "branch"'
          : "";
      case "parentOrgId":
        if (type === "branch") {
          if (!trimmed) return "Parent organisation ID is required for branch";
          if (!/^[0-9a-fA-F]{24}$/.test(trimmed))
            return "Invalid Parent organisation ID";
        }
        return "";
      case "secondaryPhone":
        if (trimmed && !/^\\+?[1-9]\\d{1,14}$/.test(trimmed))
          return "Please provide a valid phone number";
        return "";
      case "secondaryEmail":
        if (trimmed && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(trimmed))
          return "Please provide a valid email";
        return "";
      case "customDomain":
        if (
          trimmed &&
          !/^[a-z0-9]+([\\\\-\\\\.]{1}[a-z0-9]+)*\\\\.[a-z]{2,}$/.test(trimmed)
        )
          return "Please provide a valid domain name";
        return "";
      case "tier":
        return !["basic", "pro", "enterprise"].includes(trimmed)
          ? 'Tier must be "basic", "pro", or "enterprise"'
          : "";
      default:
        return "";
    }
  };

  const getFieldValue = (field: string): any => {
    if (field.startsWith("address.")) {
      const subField = field.split(".")[1];
      return formData.address[subField as keyof typeof formData.address];
    }
    return formData[field as keyof typeof formData];
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const fields = [
      "organisationName",
      "primaryPhone",
      "email",
      "type",
      "address.line1",
      "address.city",
      "address.state",
      "address.country",
    ];
    fields.forEach((field) => {
      const value = getFieldValue(field);
      const error = validateField(field, value, formData.type);
      if (error) errors[field] = error;
    });
    // Optional fields
    ["secondaryPhone", "secondaryEmail", "customDomain", "tier"].forEach(
      (field) => {
        const value = getFieldValue(field);
        const error = validateField(field, value);
        if (error) errors[field] = error;
      },
    );
    // Conditional
    if (formData.type === "branch") {
      const parentError = validateField(
        "parentOrgId",
        formData.parentOrgId,
        formData.type,
      );
      if (parentError) errors.parentOrgId = parentError;
    }
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check user role on mount and set default type using access control utility
  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const user = JSON.parse(userDetails);
      const role = user.role as UserRole | undefined;
      setUserRole(role || "");

      // Use access control utility to check if super admin
      const isSuper = isSuperAdmin(role);
      setIsSuperAdminRole(isSuper);

      // Set default type based on role - non-super admins can only create branches
      if (!isSuper) {
        setFormData((prev) => ({ ...prev, type: "branch" }));
      }
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
        taxPercentage: 18,
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
        ratingEnabled: false,
        reviewsEnabled: false,
        loyaltyEnabled: false,
        tableOrderingEnabled: false,
        takeawayEnabled: false,
        deliveryEnabled: false,
      },
      limits: {
        maxUsers: 10,
        maxQRs: 5,
        maxBranches: 3,
      },
    },
  });

  const handleChange = (field: string, value: any) => {
    // Clear client error for this field
    setClientErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
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

    if (!validateForm()) {
      setError("Please fix all validation errors before submitting");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        organisationName: formData.organisationName,
        displayName: formData.displayName,
        tagLine: formData.tagLine || undefined,
        logo: formData.logo || undefined,
        customDomain: formData.customDomain || undefined,
        type: formData.type as "company" | "branch",
        tier: formData.tier,
        parentOrgId: formData.parentOrgId || null,
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
          limits: isSuperAdminRole ? formData.configurations.limits : undefined,
        },
      };

      const response = await organisationService.createOrganisation(payload);

      if (response.success) {
        setSuccess(true);
        setFieldErrors({});
        // Reset form
        setFormData({
          organisationName: "",
          displayName: "",
          tagLine: "",
          logo: "",
          customDomain: "",
          type: "company",
          tier: "basic",
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
            enabledMethods: [],
          },
          configurations: {
            business: {
              taxPercentage: 18,
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
              weeklyOff: [],
            },
            features: {
              videoMenuEnabled: false,
              multiLanguageEnabled: false,
              ratingEnabled: false,
              reviewsEnabled: false,
              loyaltyEnabled: false,
              tableOrderingEnabled: false,
              takeawayEnabled: false,
              deliveryEnabled: false,
            },
            limits: {
              maxUsers: 10,
              maxQRs: 5,
              maxBranches: 3,
            },
          },
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
          setError(response.message || "Failed to create organisation");
        }
      }
    } catch (err: any) {
      const errorData = err as any;
      if (errorData.status === 403) {
        if (
          errorData.message?.includes("company") ||
          errorData.message?.includes("SuperAdmin")
        ) {
          setError(
            "Access denied: Only SuperAdmin can create company organisations",
          );
        } else if (
          errorData.message?.includes("tier") ||
          errorData.message?.includes("limit")
        ) {
          setError(
            "Access denied: Only SuperAdmin can set organisation tier or custom limits",
          );
        } else {
          setError(
            "Access denied: Insufficient permissions to perform this action",
          );
        }
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        const errors: Record<string, string> = {};
        (errorData.errors as FieldError[]).forEach((err: FieldError) => {
          errors[err.field] = err.message;
        });
        setFieldErrors(errors);
        setError(errorData.message || "Validation failed");
      } else {
        setError(
          errorData.message || err.message || "Failed to create organisation",
        );
      }
    } finally {
      setLoading(false);
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
                onBlur={() => {
                  const error = validateField(
                    "organisationName",
                    formData.organisationName,
                  );
                  if (error)
                    setClientErrors((prev) => ({
                      ...prev,
                      organisationName: error,
                    }));
                }}
                required
                error={
                  !!(
                    clientErrors.organisationName ||
                    fieldErrors.organisationName
                  )
                }
                helperText={
                  clientErrors.organisationName || fieldErrors.organisationName
                }
                slotProps={{ htmlInput: { maxLength: 200 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Display Name"
                value={formData.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                required
                error={!!fieldErrors.displayName}
                helperText={fieldErrors.displayName}
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
              {isSuperAdminRole ? (
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
                <TextField fullWidth label="Type" value="Branch" disabled />
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {isSuperAdminRole ? (
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
                <TextField fullWidth label="Tier" value="Basic" disabled />
              )}
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
                onBlur={() => {
                  const error = validateField(
                    "primaryPhone",
                    formData.primaryPhone,
                  );
                  if (error)
                    setClientErrors((prev) => ({
                      ...prev,
                      primaryPhone: error,
                    }));
                }}
                required
                error={
                  !!(clientErrors.primaryPhone || fieldErrors.primaryPhone)
                }
                helperText={
                  clientErrors.primaryPhone || fieldErrors.primaryPhone
                }
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
                onBlur={() => {
                  const error = validateField("email", formData.email);
                  if (error)
                    setClientErrors((prev) => ({ ...prev, email: error }));
                }}
                required
                error={!!(clientErrors.email || fieldErrors.email)}
                helperText={clientErrors.email || fieldErrors.email}
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
                onBlur={() => {
                  const error = validateField(
                    "address.line1",
                    formData.address.line1,
                  );
                  if (error)
                    setClientErrors((prev) => ({
                      ...prev,
                      "address.line1": error,
                    }));
                }}
                required
                error={
                  !!(
                    clientErrors["address.line1"] ||
                    fieldErrors["address.line1"]
                  )
                }
                helperText={
                  clientErrors["address.line1"] || fieldErrors["address.line1"]
                }
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
                onBlur={() => {
                  const error = validateField(
                    "address.city",
                    formData.address.city,
                  );
                  if (error)
                    setClientErrors((prev) => ({
                      ...prev,
                      "address.city": error,
                    }));
                }}
                required
                error={
                  !!(
                    clientErrors["address.city"] || fieldErrors["address.city"]
                  )
                }
                helperText={
                  clientErrors["address.city"] || fieldErrors["address.city"]
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="State"
                value={formData.address.state}
                onChange={(e) => handleChange("address.state", e.target.value)}
                onBlur={() => {
                  const error = validateField(
                    "address.state",
                    formData.address.state,
                  );
                  if (error)
                    setClientErrors((prev) => ({
                      ...prev,
                      "address.state": error,
                    }));
                }}
                required
                error={
                  !!(
                    clientErrors["address.state"] ||
                    fieldErrors["address.state"]
                  )
                }
                helperText={
                  clientErrors["address.state"] || fieldErrors["address.state"]
                }
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
                onBlur={() => {
                  const error = validateField(
                    "address.country",
                    formData.address.country,
                  );
                  if (error)
                    setClientErrors((prev) => ({
                      ...prev,
                      "address.country": error,
                    }));
                }}
                required
                error={
                  !!(
                    clientErrors["address.country"] ||
                    fieldErrors["address.country"]
                  )
                }
                helperText={
                  clientErrors["address.country"] ||
                  fieldErrors["address.country"]
                }
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Payment Details - Only visible to Super Admin */}
        {isSuperAdminRole && (
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
        {isSuperAdminRole && (
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
        {isSuperAdminRole && (
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
                  slotProps={{ inputLabel: { shrink: true } }}
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
                  slotProps={{ inputLabel: { shrink: true } }}
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
        {isSuperAdminRole && (
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
                  slotProps={{ htmlInput: { min: 1 } }}
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
                  slotProps={{ htmlInput: { min: 1 } }}
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
                  slotProps={{ htmlInput: { min: 1 } }}
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
            href="/administrator/organisations/list"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Organisation"}
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
