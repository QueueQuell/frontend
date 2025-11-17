"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from "@mui/material";
import Link from "next/link";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumb from "../../components/ui/Breadcrumb";

const orders = [
  { id: 1001, customer: "John Doe", items: 3, total: 45.97, status: "Completed", date: "2024-01-15" },
  { id: 1002, customer: "Jane Smith", items: 2, total: 28.98, status: "In Progress", date: "2024-01-15" },
  { id: 1003, customer: "Bob Johnson", items: 1, total: 15.99, status: "Pending", date: "2024-01-15" },
];

export default function OrderListPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Orders", href: "/orders" },
              { label: "List" },
            ]}
          />
          <Button component={Link} href="/orders/create" variant="contained" startIcon={<AddIcon />}>
            Create Order
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={
                        order.status === "Completed" ? "success" :
                        order.status === "In Progress" ? "warning" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Button size="small">View</Button>
                    <Button size="small" color="primary">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/orders" variant="outlined">
            ← Back to Orders
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
