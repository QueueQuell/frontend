"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from "@mui/material";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1234567890", status: "Active", orders: 15 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", status: "Active", orders: 8 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", status: "Inactive", orders: 3 },
];

export default function CustomerListPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Customer List
          </Typography>
          <Button component={Link} href="/customers/add" variant="contained" startIcon={<PersonIcon />}>
            Add Customer
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={customer.status === "Active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/customers" variant="outlined">
            ← Back to Customers
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
