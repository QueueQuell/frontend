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
};

export default function CommonLayout({ children, sidebarWidth = 280 }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <RequireAuth>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Header onMenuClick={handleDrawerToggle} />
                <Box sx={{ display: "flex", flex: 1 }}>
                    <Sidebar
                        mobileOpen={mobileOpen}
                        onMobileClose={handleDrawerToggle}
                    />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            width: { md: `calc(100% - ${sidebarWidth}px)` },
                            ml: { md: `${sidebarWidth}px` },
                        }}
                    >
                        <PageLoader>
                            {children}
                        </PageLoader>
                    </Box>
                </Box>
                <Footer />
            </Box>
        </RequireAuth>
    );
}
