"use client";
import CommonLayout from "@/components/layouts/CommonLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { Box, Grid, Card, CardContent, CardActions, Button, Chip, Drawer, Typography } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { useState } from "react";

const tables = [
  { id: 1, number: "T01", status: "Active", qrGenerated: true },
  { id: 2, number: "T02", status: "Active", qrGenerated: true },
  { id: 3, number: "T03", status: "Inactive", qrGenerated: false },
  { id: 4, number: "T04", status: "Active", qrGenerated: true },
];

export default function QRTablesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<typeof tables[0] | null>(null);

  const handleViewDetails = (table: typeof tables[0]) => {
    setSelectedTable(table);
    setDrawerOpen(true);
  };

  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "QR", href: "/qr" },
            { label: "Tables" },
          ]}
        />
        <Grid container spacing={3}>
          {tables.map((table) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={table.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TableRestaurantIcon sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h6">Table {table.number}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={table.status}
                      color={table.status === "Active" ? "success" : "default"}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={table.qrGenerated ? "QR Generated" : "No QR"}
                      color={table.qrGenerated ? "primary" : "warning"}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<QrCodeIcon />}>
                    {table.qrGenerated ? "Regenerate" : "Generate"} QR
                  </Button>
                  <Button size="small" onClick={() => handleViewDetails(table)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <PageFooter backHref="/qr" backText="Back to QR Codes" />
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            p: 3,
          },
        }}
      >
        {selectedTable && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Table {selectedTable.number} Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Status: {selectedTable.status}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              QR Code: {selectedTable.qrGenerated ? "Generated" : "Not Generated"}
            </Typography>
            <Button variant="contained" fullWidth>
              {selectedTable.qrGenerated ? "Regenerate QR" : "Generate QR"}
            </Button>
          </Box>
        )}
      </Drawer>
    </CommonLayout>
  );
}
