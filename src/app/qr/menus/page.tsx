"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import CommonCard from "../../components/CommonCard";
import { Typography, Box, Grid, Button, Chip } from "@mui/material";
import Link from "next/link";
import QrCodeIcon from "@mui/icons-material/QrCode";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

const menus = [
  { id: 1, name: "Main Menu", type: "Full Menu", status: "Active", qrGenerated: true },
  { id: 2, name: "Lunch Specials", type: "Special", status: "Active", qrGenerated: true },
  { id: 3, name: "Kids Menu", type: "Special", status: "Inactive", qrGenerated: false },
  { id: 4, name: "Beverages", type: "Drinks", status: "Active", qrGenerated: true },
];

export default function QRMenuPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Menu QR Codes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Generate QR codes for different menu categories
        </Typography>
        <Grid container spacing={3}>
          {menus.map((menu) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={menu.id}>
              <CommonCard
                title={menu.name}
                icon={RestaurantMenuIcon}
                actions={
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={menu.type}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={menu.status}
                        color={menu.status === "Active" ? "success" : "default"}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={menu.qrGenerated ? "QR Generated" : "No QR"}
                        color={menu.qrGenerated ? "primary" : "warning"}
                        size="small"
                      />
                    </Box>
                    <Button size="small" startIcon={<QrCodeIcon />}>
                      {menu.qrGenerated ? "Regenerate" : "Generate"} QR
                    </Button>
                    <Button size="small">Edit Menu</Button>
                  </>
                }
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/qr" variant="outlined">
            ← Back to QR Codes
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
