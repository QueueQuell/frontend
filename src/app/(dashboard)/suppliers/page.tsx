"use client";
import CommonLayout from "@/components/layouts/CommonLayout";
import CommonCard from "@/components/CommonCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { Box, Grid } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";

const supplierActions = [
  { href: "/suppliers/list", label: "Supplier List", icon: BusinessIcon, description: "View all supplier profiles" },
  { href: "/suppliers/procurement", label: "Procurement", icon: ShoppingCartIcon, description: "Manage procurement records" },
  { href: "/suppliers/add", label: "Add Supplier", icon: AddIcon, description: "Create new supplier profile" },
];

export default function SuppliersPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Suppliers" },
          ]}
        />
        <Grid container spacing={3}>
          {supplierActions.map((action) => (
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
