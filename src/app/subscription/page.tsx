"use client";
import CommonLayout from "../components/layouts/CommonLayout";
import { Box, Typography } from "@mui/material";
import Breadcrumb from "@/app/components/ui/Breadcrumb";

export default function SubscriptionPage() {
  return (
    <CommonLayout>
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
    </CommonLayout>
  );
}
