// src/components/layouts/RootLayout.tsx
"use client";

import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/Header";
import Footer from "../navigation/Footer";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleSidebarToggle = () => setSidebarCollapsed(!sidebarCollapsed);

  const currentSidebarWidth = sidebarCollapsed ? 80 : 260;

  return (
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
        <Header
        //  onMenuClick={handleDrawerToggle}
          />
        
        <Box 
          component="main"
          sx={{ 
            flex: 1, 
            pr: 3, 
            pl: 3, 
            pt: 2, 
            pb: 1, 
            overflowY: "auto", 
            backgroundColor: "#F9FAFC" 
          }}
        >
          {children}
        </Box>
        
        <Footer />
      </Box>
    </Box>
  );
}