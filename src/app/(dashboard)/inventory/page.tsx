"use client";
import CommonCard from "@/components/CommonCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Box, Grid } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AssessmentIcon from "@mui/icons-material/Assessment";

const inventoryActions = [
  { href: "/inventory/list", label: "List Inventory", icon: ListIcon, description: "View items, stock levels and totals." },
  { href: "/inventory/add", label: "Add Inventory", icon: AddIcon, description: "Create new inventory records." },
  { href: "/inventory/adjust", label: "Stock Adjustment", icon: EditIcon, description: "Increase or decrease stock with audit." },
  { href: "/inventory", label: "Reports", icon: AssessmentIcon, description: "Stock movement & valuation reports." },
];

export default function InventoryPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Inventory" },
        ]}
      />
      <Grid container spacing={3}>
        {inventoryActions.map((action) => (
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
