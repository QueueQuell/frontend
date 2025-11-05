"use client";
import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AccountSidebar() {
    const router = useRouter();

    const handleSignOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenType");
        router.push("/login");
    };

    return (
        <Box
            sx={{
                width: 220,
                bgcolor: "#f5f6f8",
                height: "100%",
                borderRight: "1px solid #e0e0e0",
                p: 2,
            }}
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/users/profile">
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/users/address">
                        <ListItemIcon>
                            <LocationOnIcon />
                        </ListItemIcon>
                        <ListItemText primary="Address" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleSignOut}
                fullWidth
            >
                Sign Out
            </Button>
        </Box>
    );
}
