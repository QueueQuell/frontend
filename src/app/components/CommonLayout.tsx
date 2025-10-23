"use client";
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RequireAuth from "./RequireAuth";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

type Props = {
    children: React.ReactNode;
    sidebarWidth?: number | string;
};

export default function CommonLayout({ children, sidebarWidth = 240 }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <RequireAuth>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Header onMenuClick={() => setDrawerOpen(true)} />
                <div style={{ display: "flex", flex: 1, alignItems: "stretch" }}>
                    <main style={{ flex: 1, padding: 20 }}>
                        {children}
                    </main>
                </div>
                <Footer />
            </div>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: sidebarWidth,
                    },
                }}
            >
                <Sidebar />
            </Drawer>
        </RequireAuth>
    );
}
