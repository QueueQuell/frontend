"use client";
import { Typography, Box, Paper, Grid, Card, CardContent, LinearProgress, Button } from "@mui/material";
import Link from "next/link";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import StarIcon from "@mui/icons-material/Star";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CommonLayout from "@/components/layouts/CommonLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";

const loyaltyPrograms = [
  { id: 1, name: "Gold Member", members: 45, points: 1500, benefits: "Free delivery, Priority seating" },
  { id: 2, name: "Silver Member", members: 78, points: 800, benefits: "Discount on orders, Birthday rewards" },
  { id: 3, name: "Bronze Member", members: 120, points: 300, benefits: "Welcome discount, Newsletter access" },
];

export default function LoyaltyPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Customers", href: "/customers" },
              { label: "Loyalty" },
            ]}
          />
          <Button component={Link} href="/customers/loyalty/add" variant="contained" startIcon={<LoyaltyIcon />}>
            Create Program
          </Button>
        </Box>
        <Grid container spacing={3}>
          {loyaltyPrograms.map((program) => (
            <Grid size={{ xs: 12, md: 4 }} key={program.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <StarIcon sx={{ mr: 1, color: "gold" }} />
                    <Typography variant="h6">{program.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {program.members} members
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Required Points: {program.points}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Benefits: {program.benefits}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <PageFooter backHref="/customers" backText="Back to Customers" />
      </Box>
    </CommonLayout>
  );
}
