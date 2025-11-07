"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from "@mui/material";
import Link from "next/link";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";

const suppliers = [
  { id: 1, name: "Fresh Produce Co.", category: "Vegetables", status: "Active", contact: "john@freshproduce.com" },
  { id: 2, name: "Meat Masters", category: "Meat", status: "Active", contact: "sarah@meatmasters.com" },
  { id: 3, name: "Dairy Delights", category: "Dairy", status: "Inactive", contact: "mike@dairydelights.com" },
];

export default function SupplierListPage() {
  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Supplier List
          </Typography>
          <Button component={Link} href="/suppliers/add" variant="contained" startIcon={<AddIcon />}>
            Add Supplier
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BusinessIcon sx={{ mr: 1 }} />
                      {supplier.name}
                    </Box>
                  </TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>
                    <Chip
                      label={supplier.status}
                      color={supplier.status === "Active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
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
          <Button component={Link} href="/suppliers" variant="outlined">
            ← Back to Suppliers
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
