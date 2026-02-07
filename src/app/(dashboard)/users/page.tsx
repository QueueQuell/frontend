"use client";
import CommonCard from "@/components/CommonCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Box, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const userActions = [
  { href: "/users/profile", label: "Profile", icon: PersonIcon, description: "Manage your profile information" },
  { href: "/users/address", label: "Address", icon: LocationOnIcon, description: "Manage your addresses" },
];

export default function UsersPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "User Management" },
        ]}
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
  );
}
