"use client";
import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import RequireAuth from "../auth/RequireAuth";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/Header";
import Footer from "../navigation/Footer";

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
                        ml: `${currentSidebarWidth}px`,
                        transition: "margin-left 0.3s ease",
                    }}
                >
                    <Header />
                    <Box sx={{ flex: 1, pr: 3, pl: 3, pt: 2, pb: 1, overflowY: "auto", backgroundColor: "#F9FAFC" }}>
                        {children}
                    </Box>
                    <Footer />
                </Box>
            </Box>
        </RequireAuth>
    );
}
