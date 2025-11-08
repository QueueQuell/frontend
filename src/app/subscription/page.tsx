import React from "react";
import { Box, Typography } from "@mui/material";
import PageHeader from "@/app/components/ui/PageHeader";

export default function SubscriptionPage() {
  return (
    <Box>
      <PageHeader title="Subscription" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Subscription Page</Typography>
        <Typography variant="body1" color="text.secondary">
          This is a placeholder for the Subscription section.
        </Typography>
      </Box>
    </Box>
  );
}
