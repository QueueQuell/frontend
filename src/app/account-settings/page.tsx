import React from "react";
import { Box, Typography } from "@mui/material";
import PageHeader from "@/app/components/ui/PageHeader";

export default function AccountSettingsPage() {
  return (
    <Box>
      <PageHeader title="Account Settings" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Account Settings Page</Typography>
        <Typography variant="body1" color="text.secondary">
          This is a placeholder for the Account Settings section.
        </Typography>
      </Box>
    </Box>
  );
}
