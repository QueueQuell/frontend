"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";

interface AdminTile {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function AdministratorPage() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        const userDetails = JSON.parse(storedUserDetails);
        setUserRole(userDetails.role);
      }
    } catch (error) {
      console.warn("Failed to load user details:", error);
    }
  }, []);

  const adminTiles: AdminTile[] = [
    {
      title: "Organisations",
      description: "Manage organisations, branches, and company settings",
      icon: <BusinessIcon sx={{ fontSize: 48, color: "#1976d2" }} />,
      href: "/administrator/organisations",
      color: "#e3f2fd",
    },
    {
      title: "Users",
      description: "Create, manage, and monitor user accounts and permissions",
      icon: <PeopleIcon sx={{ fontSize: 48, color: "#2e7d32" }} />,
      href: "/administrator/users",
      color: "#e8f5e9",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[{ label: "Home", href: "/home" }, { label: "Administrator" }]}
        />
      </Box>

      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Administrator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your organisation settings, users, and permissions
      </Typography>

      <Grid container spacing={3}>
        {adminTiles.map((tile) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tile.title}>
            <Card
              sx={{
                height: "100%",
                bgcolor: tile.color,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                component={Link}
                href={tile.href}
                sx={{ height: "100%", p: 2 }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{tile.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {tile.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tile.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {userRole && (
        <Box sx={{ mt: 4, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Logged in as: <strong>{userRole.replace(/_/g, " ")}</strong>
          </Typography>
        </Box>
      )}

      <PageFooter backHref="/home" backText="Back to Home" />
    </Box>
  );
}
