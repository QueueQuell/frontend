"use client";
import CommonLayout from "../components/layouts/CommonLayout";
import CommonCard from "../components/CommonCard";
import PageHeader from "../components/ui/PageHeader";
import { Box, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const userActions = [
  { href: "/users/profile", label: "Profile", icon: PersonIcon, description: "Manage your profile information" },
  { href: "/users/address", label: "Address", icon: LocationOnIcon, description: "Manage your addresses" },
];

export default function UsersPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="User Management"
          description="Manage users and roles"
        />
        <Grid container spacing={3}>
          {userActions.map((action) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={action.href}>
              <CommonCard
                title={action.label}
                description={action.description}
                icon={action.icon}
                href={action.href}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </CommonLayout>
  );
}
