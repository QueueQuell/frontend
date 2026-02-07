"use client";
import React, { useEffect, useState } from "react";
import AccountLayout from "@/components/layouts/AccountLayout";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { Subscription, subscriptionService } from "@/lib/api";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await subscriptionService.getSubscription();
        const data = response.success ? (response.data) ?? null : null;
        setSubscription(data);
      } catch (err: any) {
        console.error("Failed to fetch subscription:", err);
        setError(err.message || "Failed to load subscription information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "trial":
        return "info";
      case "cancelled":
        return "warning";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon />;
      case "cancelled":
      case "expired":
        return <CancelIcon />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AccountLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress />
        </Box>
      </AccountLayout>
    );
  }

  if (error) {
    return (
      <AccountLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Box>
      </AccountLayout>
    );
  }

  if (!subscription) {
    return (
      <AccountLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Subscription
          </Typography>
          <Alert severity="info">No active subscription found.</Alert>
        </Box>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            QueueQuell Subscription
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your current subscription and billing information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Subscription Card */}
          <Grid size={{xs:12, md:8}}>
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {subscription.plan}
                    </Typography>
                    {subscription.organizationName && (
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}>
                        <BusinessIcon sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {subscription.organizationName}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Chip
                    // icon={getStatusIcon(subscription.status)}
                    label={subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    color={getStatusColor(subscription.status) as any}
                    sx={{ textTransform: "capitalize" }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{xs:12, sm:6}}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CreditCardIcon sx={{ mr: 2, color: "primary.main" }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Billing Amount
                        </Typography>
                        <Typography variant="h6">
                          {formatCurrency(subscription.amount? subscription.amount : 0, subscription.currency)}
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            / {subscription.billingCycle === "monthly" ? "month" : "year"}
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{xs:12, sm:6}}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarIcon sx={{ mr: 2, color: "primary.main" }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Billing Cycle
                        </Typography>
                        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                          {subscription.billingCycle}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{xs:12, sm:6}}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Period Start
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(subscription.currentPeriodStart)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{xs:12, sm:6}}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Period End
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(subscription.currentPeriodEnd)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {subscription.cancelAtPeriodEnd && (
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    Your subscription will be cancelled at the end of the current billing period.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Features Card */}
          <Grid size={{xs:12, md:4}}>
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Plan Features
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {subscription.features && subscription.features.length > 0 ? (
                    subscription.features.map((feature, index) => (
                      <li key={index}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {feature}
                        </Typography>
                      </li>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No features listed
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary">
            Manage Subscription
          </Button>
          <Button variant="outlined" color="primary">
            View Billing History
          </Button>
          {subscription.status === "active" && !subscription.cancelAtPeriodEnd && (
            <Button variant="outlined" color="error">
              Cancel Subscription
            </Button>
          )}
        </Box>
      </Box>
    </AccountLayout>
  );
}

