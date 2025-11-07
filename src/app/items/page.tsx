"use client";
import CommonLayout from "../components/layouts/CommonLayout";
import CommonCard from "../components/CommonCard";
import PageHeader from "../components/ui/PageHeader";
import PageFooter from "../components/ui/PageFooter";
import { Box, Grid } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";

const itemActions = [
  { href: "/items/catalog", label: "Menu Catalog", icon: RestaurantMenuIcon, description: "Browse complete menu items" },
  { href: "/items/list", label: "Item List", icon: ListIcon, description: "View all items with details" },
  { href: "/items/add", label: "Add Item", icon: AddIcon, description: "Create new menu item" },
];

export default function ItemsPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Items"
          description="Catalog of menu items and item management"
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
