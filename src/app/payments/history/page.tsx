"use client";
import CommonLayout from "../../components/CommonLayout";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import Link from "next/link";
import Button from "@mui/material/Button";
import ReceiptIcon from "@mui/icons-material/Receipt";

const paymentHistory = [
  { id: 1001, orderId: "ORD-001", amount: 45.97, method: "Credit Card", status: "Completed", date: "2024-01-15" },
  { id: 1002, orderId: "ORD-002", amount: 28.98, method: "Cash", status: "Completed", date: "2024-01-15" },
  { id: 1003, orderId: "ORD-003", amount: 15.99, method: "Digital Wallet", status: "Pending", date: "2024-01-15" },
];

export default function PaymentHistoryPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Payment History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>#{payment.id}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      color={payment.status === "Completed" ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Button size="small">View Receipt</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/payments" variant="outlined">
            ← Back to Payments
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
