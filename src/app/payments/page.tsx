"use client";
import CommonLayout from "../components/layouts/CommonLayout";
import CommonCard from "../components/CommonCard";
import Breadcrumb from "../components/ui/Breadcrumb";
import PageFooter from "../components/ui/PageFooter";
import { Box, Grid } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const paymentActions = [
  { href: "/payments/transactions", label: "Payment Transactions", icon: PaymentIcon, description: "View all payment records" },
  { href: "/payments/receipts", label: "Receipts", icon: ReceiptIcon, description: "Generate and manage receipts" },
  { href: "/payments/reconciliation", label: "Reconciliation", icon: AccountBalanceIcon, description: "Payment reconciliation tools" },
];

export default function PaymentsPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Payments" },
          ]}
        />
        <Grid container spacing={3}>
          {paymentActions.map((action) => (
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
