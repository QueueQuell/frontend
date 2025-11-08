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
import CommonLayout from "../../components/layouts/CommonLayout";
import { inventoryApi } from "../../lib/api";
import { ItemOut } from "../../lib/types";

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
  const [items, setItems] = useState<ItemOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await inventoryApi.getItems();
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch inventory items:', err);
        setError('Failed to load inventory items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const totalValue = items.reduce((sum, item) => {
    // Note: API doesn't provide unit cost, so we'll use a placeholder or calculate differently
    // For now, we'll assume unit cost is not available from API
    return sum;
  }, 0);

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
                      <Chip label="Food" size="small" color="primary" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="medium">
                        0 {/* Placeholder - stock levels need separate API call */}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell align="right">-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell align="right">-</TableCell>
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
    </CommonLayout>
  );
}
