"use client";
import CommonLayout from "@/components/layouts/CommonLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { Box } from "@mui/material";
import { useSearchParams } from "next/navigation";
import PaymentActions from "@/components/payments/PaymentActions";
import PaymentTransactions from "@/components/payments/PaymentTransactions";
import PaymentReceipts from "@/components/payments/PaymentReceipts";
import PaymentReconciliation from "@/components/payments/PaymentReconciliation";

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const subcategory = searchParams.get("subcategory");

  const renderContent = () => {
    switch (subcategory) {
      case "transactions":
        return <PaymentTransactions />;
      case "receipts":
        return <PaymentReceipts />;
      case "reconciliation":
        return <PaymentReconciliation />;
      default:
        return <PaymentActions />;
    }
  };

  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Payments" },
          ]}
        />
        {renderContent()}
        <PageFooter backHref="/home" backText="Back to Home" />
      </Box>
    </CommonLayout>
  );
}
