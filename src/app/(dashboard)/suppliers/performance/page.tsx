"use client";
import { Typography, Box, Grid, Card, CardContent, CardActions, Button, Chip, LinearProgress } from "@mui/material";
import Link from "next/link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StarIcon from "@mui/icons-material/Star";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";

const suppliers = [
  { id: 1, name: "Fresh Produce Co.", rating: 4.8, onTime: 95, quality: 92, reliability: 88 },
  { id: 2, name: "Meat Masters", rating: 4.5, onTime: 88, quality: 95, reliability: 90 },
  { id: 3, name: "Dairy Delights", rating: 4.2, onTime: 92, quality: 85, reliability: 78 },
];

export default function SupplierPerformancePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Suppliers", href: "/suppliers" },
          { label: "Performance" },
        ]}
      />
      <Grid container spacing={3}>
        {suppliers.map((supplier) => (
          <Grid size={{ xs: 12, md: 6 }} key={supplier.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {supplier.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StarIcon sx={{ color: "#ffd700", mr: 0.5 }} />
                    <Typography variant="body1">{supplier.rating}</Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    On-Time Delivery: {supplier.onTime}%
                  </Typography>
                  <LinearProgress variant="determinate" value={supplier.onTime} sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Quality Score: {supplier.quality}%
                  </Typography>
                  <LinearProgress variant="determinate" value={supplier.quality} sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Reliability: {supplier.reliability}%
                  </Typography>
                  <LinearProgress variant="determinate" value={supplier.reliability} />
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label="High Performer"
                    color="success"
                    size="small"
                    icon={<TrendingUpIcon />}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small">View Details</Button>
                <Button size="small">Contact Supplier</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <PageFooter backHref="/suppliers" backText="Back to Suppliers" />
    </Box>
  );
}
