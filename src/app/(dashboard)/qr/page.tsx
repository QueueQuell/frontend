"use client";
import CommonLayout from "@/components/layouts/CommonLayout";
import CommonCard from "@/components/CommonCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { Box, Grid } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const qrActions = [
  { href: "/qr/generate", label: "Generate QR Codes", icon: QrCodeIcon, description: "Create QR codes for tables and menus" },
  { href: "/qr/tables", label: "Table Management", icon: TableRestaurantIcon, description: "Manage table QR codes" },
  { href: "/qr/menus", label: "Menu QR Codes", icon: MenuBookIcon, description: "Digital menu QR code management" },
];

export default function QRPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "QR" },
          ]}
        />
        <Grid container spacing={3}>
          {qrActions.map((action) => (
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
