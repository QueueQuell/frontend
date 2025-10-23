"use client";
import CommonLayout from "../components/CommonLayout";
import CommonCard from "../components/CommonCard";
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import { Box, Grid } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import AddIcon from "@mui/icons-material/Add";

const customerActions = [
  { href: "/customers/list", label: "Customer List", icon: PeopleIcon, description: "View all customer profiles" },
  { href: "/customers/loyalty", label: "Loyalty Program", icon: LoyaltyIcon, description: "Manage loyalty points and rewards" },
  { href: "/customers/add", label: "Add Customer", icon: AddIcon, description: "Create new customer profile" },
];

const CustomersPage = () => {
    return (
        <CommonLayout>
            <Box sx={{ p: 3 }}>
                <PageHeader
                    title="Customers"
                    description="Customer profiles and loyalty management"
                />
                <Grid container spacing={3}>
                    {customerActions.map((action) => (
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
};

export default CustomersPage;
