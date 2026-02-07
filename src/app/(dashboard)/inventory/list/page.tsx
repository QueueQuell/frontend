"use client";
import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import Link from "next/link";
import { inventoryService } from "@/lib/api";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { randInt, randomDateWithinDays } from "@/lib/utils/mockData";

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



export default function InventoryListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // Mock data for now
        const mockItems: Item[] = [
          {
            id: "1",
            name: "Chicken Breast",
            sku: "CHB-001",
            category: "Meat",
            quantity: randInt(10, 100),
            unit: "lbs",
            unitCost: 4.99,
            location: "Refrigerator A",
            lastUpdated: randomDateWithinDays(),
          },
          {
            id: "2",
            name: "Tomatoes",
            sku: "TOM-001",
            category: "Vegetables",
            quantity: randInt(50, 150),
            unit: "lbs",
            unitCost: 2.49,
            location: "Produce Section",
            lastUpdated: randomDateWithinDays(),
          },
          {
            id: "3",
            name: "Rice",
            sku: "RIC-001",
            category: "Grains",
            quantity: randInt(100, 300),
            unit: "lbs",
            unitCost: 1.99,
            location: "Dry Goods",
            lastUpdated: randomDateWithinDays(),
          },
        ];
        setItems(mockItems);
      } catch (err) {
        console.error('Failed to fetch inventory items:', err);
        setError('Failed to load inventory items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Inventory", href: "/inventory" },
              { label: "List" },
            ]}
          />
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Loading inventory items...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No inventory items found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main" }}>
                        {item.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" color="primary" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="medium">
                      {item.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell align="right">${item.unitCost.toFixed(2)}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell align="right">${(item.quantity * item.unitCost).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button component={Link} href={`/inventory/${item.id}`} size="small" variant="outlined">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!loading && !error && items.length > 0 && (
              <TableRow>
                <TableCell colSpan={7} />
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Total Value:
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: 700 }}>
                  ${totalValue.toFixed(2)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <Button component={Link} href="/inventory" variant="outlined">
          ← Back to Inventory
        </Button>
      </Box>
    </Box>
  );
}
