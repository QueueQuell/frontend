import React from "react";
import { Box, Typography } from "@mui/material";
import PageHeader from "@/app/components/ui/PageHeader";

export default function SecurityPage() {
  return (
    <Box>
      <PageHeader title="Security" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Security Page</Typography>
        <Typography variant="body1" color="text.secondary">
          This is a placeholder for the Security section.
        </Typography>
      </Box>
    </Box>
  );
}
