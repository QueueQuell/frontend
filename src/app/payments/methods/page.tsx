"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, Grid, Card, CardContent, CardActions, Button, Switch, FormControlLabel } from "@mui/material";
import Link from "next/link";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import MoneyIcon from "@mui/icons-material/Money";
import Breadcrumb from "../../components/ui/Breadcrumb";

const paymentMethods = [
  { id: 1, name: "Credit Card", icon: CreditCardIcon, enabled: true, description: "Visa, Mastercard, American Express" },
  { id: 2, name: "Digital Wallet", icon: SmartphoneIcon, enabled: true, description: "Apple Pay, Google Pay, PayPal" },
  { id: 3, name: "Bank Transfer", icon: AccountBalanceIcon, enabled: false, description: "Direct bank account transfers" },
  { id: 4, name: "Cash", icon: MoneyIcon, enabled: true, description: "Cash payments at counter" },
];

export default function PaymentMethodsPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Payments", href: "/payments" },
            { label: "Methods" },
          ]}
        />
        <Grid container spacing={3}>
          {paymentMethods.map((method) => (
            <Grid size={{ xs: 12, sm: 6 }} key={method.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <method.icon sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h6">{method.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {method.description}
                  </Typography>
                  <FormControlLabel
                    control={<Switch checked={method.enabled} />}
                    label={method.enabled ? "Enabled" : "Disabled"}
                  />
                </CardContent>
                <CardActions>
                  <Button size="small">Configure</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/payments" variant="outlined">
            ← Back to Payments
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
