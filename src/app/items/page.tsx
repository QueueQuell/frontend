"use client";
import CommonLayout from "../components/layouts/CommonLayout";
import CommonCard from "../components/CommonCard";
import Breadcrumb from "../components/ui/Breadcrumb";
import PageFooter from "../components/ui/PageFooter";
import { Box, Grid } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";

const itemActions = [
  { href: "/items/catalog", label: "Menu Catalog", icon: RestaurantMenuIcon, description: "Browse complete menu items" },
  { href: "/items/catalog/create", label: "Create Item", icon: AddIcon, description: "Add a new item to the menu" },
  { href: "/items/sections", label: "Sections", icon: CategoryIcon, description: "Manage item Sections" },
  { href: "/items/sections/create", label: "Create Section", icon: AddIcon, description: "Add a new section for menu items" },
];

export default function ItemsPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Items" },
          ]}
        />
        <Grid container spacing={3}>
          {itemActions.map((action) => (
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
        <PageFooter backHref="/home" backText="Back to Home" />
      </Box>
    </CommonLayout>
  );
}
