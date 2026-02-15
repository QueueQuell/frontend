import { Grid } from "@mui/material";
import CommonCard from "../CommonCard";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const paymentActions = [
  { href: "/payments?subcategory=transactions", label: "Payment Transactions", icon: PaymentIcon, description: "View all payment records" },
  { href: "/payments?subcategory=receipts", label: "Receipts", icon: ReceiptIcon, description: "Generate and manage receipts" },
  { href: "/payments?subcategory=reconciliation", label: "Reconciliation", icon: AccountBalanceIcon, description: "Payment reconciliation tools" },
  { href: "/payments?subcategory=history", label: "Payment History", icon: ReceiptIcon, description: "View payment history" },
  { href: "/payments?subcategory=methods", label: "Payment Methods", icon: AccountBalanceIcon, description: "Manage payment methods" },
];

export default function PaymentActions() {
  return (
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
  );
}
