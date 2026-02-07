"use client";

import React, { useState, Suspense } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import RequireAuth from "@/components/auth/RequireAuth";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const currentSidebarWidth = sidebarCollapsed ? 80 : 260;

  return (
    <RequireAuth>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={handleDrawerToggle}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={handleSidebarToggle}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            ml: isMobile ? 0 : `${currentSidebarWidth}px`,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Header />
          <Box sx={{ flex: 1, pr: 3, pl: 3, pt: 2, pb: 1, overflowY: "auto", backgroundColor: "#F9FAFC" }}>
            <Suspense fallback={<LoadingFallback />}>
              {children}
            </Suspense>
          </Box>
          <Footer />
        </Box>
      </Box>
    </RequireAuth>
  );
}
