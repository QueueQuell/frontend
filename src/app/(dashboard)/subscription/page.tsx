"use client";
import { Box, Typography } from "@mui/material";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function SubscriptionPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Subscription" },
        ]}
      />
      <Typography variant="h6">Subscription Page</Typography>
      <Typography variant="body1" color="text.secondary">
        This is a placeholder for the Subscription section.
      </Typography>
    </Box>
  );
}
