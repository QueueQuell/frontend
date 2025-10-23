"use client";
import React, { useMemo } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import Link from "next/link";
import CommonLayout from "../../components/CommonLayout";

type Item = {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  location: string;
  lastUpdated: string;
};

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithinDays(days = 30) {
  const ms = Date.now() - Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
  return new Date(ms).toISOString().slice(0, 10);
}

export default function InventoryListPage() {
  const sampleData: Item[] = useMemo(() => {
    const names = [
      "Margherita Pizza",
      "Caesar Salad",
      "Grilled Chicken Sandwich",
      "Spaghetti Bolognese",
      "Beef Burger",
      "French Fries",
      "Tiramisu",
      "Lemonade",
    ];
    const categories = ["Food", "Food", "Food", "Food", "Food", "Sides", "Dessert", "Beverage"];
    const units = ["pcs", "kg", "ltr", "box"];
    return names.map((n, i) => ({
      id: `itm-${1000 + i}`,
      name: n,
      sku: `SKU-${randInt(10000, 99999)}`,
      category: categories[i] ?? "Food",
      quantity: randInt(0, 200),
      unit: units[i % units.length],
      unitCost: parseFloat((Math.random() * 20 + 1).toFixed(2)),
      location: ["Main Kitchen", "Cold Room", "Pantry"][i % 3],
      lastUpdated: randomDateWithinDays(90),
    }));
  }, []);

  const totalValue = sampleData.reduce((s, it) => s + it.quantity * it.unitCost, 0);

  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Inventory List
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          View items, stock levels and totals
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button component={Link} href="/inventory/add" variant="contained" startIcon={<Inventory2Icon />}>
              Add New Item
            </Button>
            <Button component={Link} href="/inventory/adjust" variant="outlined">
              Adjust Stock
            </Button>
            <Button variant="outlined">Export</Button>
          </Stack>
        </Box>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main" }}>
                        {row.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>
                    <Chip label={row.category} size="small" color="primary" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="medium">
                      {row.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell align="right">${row.unitCost.toFixed(2)}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell align="right">
                    ${(row.quantity * row.unitCost).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button component={Link} href={`/inventory/${row.id}`} size="small" variant="outlined">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7} />
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Total Value:
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: 700 }}>
                  ${totalValue.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2 }}>
          <Button component={Link} href="/inventory" variant="outlined">
            ← Back to Inventory
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
