"use client";
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RequireAuth from "./RequireAuth";
import PageLoader from "./PageLoader";
import { Box, useMediaQuery, useTheme } from "@mui/material";

type Props = {
    children: React.ReactNode;
    sidebarWidth?: number | string;
    collapsed?: boolean;
};

export default function CommonLayout({ children, sidebarWidth = 260, collapsed = false }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(collapsed);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const currentSidebarWidth = sidebarCollapsed ? 80 : sidebarWidth;

    return (
        <RequireAuth>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                {/* Page Header */}
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1100,
                        bgcolor: "white",
                        borderBottom: "1px solid #E6E6E6",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Header onMenuClick={handleDrawerToggle} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {/* Page title placeholder */}
                        <Box sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#1A1A1A" }}>
                            Dashboard
                        </Box>
                        {/* Notification bell and profile icons can be added here */}
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flex: 1 }}>
                    <Sidebar
                        mobileOpen={mobileOpen}
                        onMobileClose={handleDrawerToggle}
                        collapsed={sidebarCollapsed}
                        onToggleCollapsed={handleSidebarToggle}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        {/* Main Content Body */}
                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                p: 3,
                                bgcolor: "#F9FAFC",
                                width: { md: `calc(100% - ${currentSidebarWidth}px)` },
                                ml: { md: `${currentSidebarWidth}px` },
                                transition: "all 0.3s ease",
                                overflowY: "auto",
                            }}
                        >
                            <PageLoader>
                                {children}
                            </PageLoader>
                        </Box>

                        {/* Page Footer */}
                        <Box
                            sx={{
                                position: "sticky",
                                bottom: 0,
                                bgcolor: "#F1F3F5",
                                borderTop: "1px solid #E6E6E6",
                                p: 2,
                                textAlign: "center",
                                fontSize: "0.875rem",
                                color: "#777",
                                height: "60px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            © 2025 QueueQuell. All rights reserved.
                        </Box>
                    </Box>
                </Box>
            </Box>
        </RequireAuth>
    );
}
