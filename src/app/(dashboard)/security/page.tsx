"use client";
import CommonLayout from "@/components/layouts/CommonLayout";
import { Box, Typography } from "@mui/material";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function SecurityPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Security" },
          ]}
        />
        <Typography variant="h6">Security Page</Typography>
        <Typography variant="body1" color="text.secondary">
          This is a placeholder for the Security section.
        </Typography>
      </Box>
    </CommonLayout>
  );
}
