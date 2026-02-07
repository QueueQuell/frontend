// src/app/(dashboard)/template.tsx
"use client";

import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import RequireAuth from "@/components/auth/RequireAuth";
import RootLayout from "../layout";

function LoadingFallback() {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh" 
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <RootLayout>
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </RootLayout>
    </RequireAuth>
  );
}