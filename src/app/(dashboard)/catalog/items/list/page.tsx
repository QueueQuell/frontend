"use client";

import { useState, useEffect } from "react";
import SnackbarAlert from "@/components/ui/SnackbarAlert";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { menuService } from "@/lib/api/services/menu.service";
import type { MenuItemType } from "@/lib/api/types";

export default function ItemsListPage() {
  const [items, setItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [deleteDialog, setDeleteDialog] = useState<
    { open: false } | { open: true; itemId: string; itemName: string }
  >({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fetchItems = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await menuService.getAll();
      if (response.success && response.data) {
        setItems(response.data as MenuItemType[]);
      } else {
        setError(response.message || "Failed to fetch items");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredItems = Array.isArray(items)
    ? items.filter((item: MenuItemType) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.category?.name?.toLowerCase().includes(query) ||
          item.category?.id?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query)
        );
      })
    : [];

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleDeleteOpen = (itemId: string, itemName: string) => {
    setDeleteDialog({ open: true, itemId, itemName });
  };

  const handleDeleteClose = () => {
    setDeleteDialog({ open: false });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.open && deleteDialog.itemId) {
      try {
        setDeleting(true);
        await menuService.delete(deleteDialog.itemId);
        setSnackbar({
          open: true,
          message: "Item deleted successfully",
          severity: "success",
        });
        fetchItems();
        handleDeleteClose();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to delete item",
          severity: "error",
        });
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStockStatus = (quantity: number, minStock?: number) => {
    if (minStock && quantity < minStock) return "Low Stock";
    return "In Stock";
  };

  const getStockColor = (quantity: number, minStock?: number) => {
    if (minStock && quantity < minStock) return "warning";
    return "success";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Catalog", href: "/catalog" },
          { label: "Items" },
        ]}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Items ({Array.isArray(filteredItems) ? filteredItems.length : 0}{" "}
            total)
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search items by name, SKU or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: 300 }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchItems}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              component={Link}
              href="/catalog/items/create"
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ whiteSpace: "nowrap" }}>
                    <TableCell sx={{ width: 120 }}>Item ID</TableCell>
                    <TableCell sx={{ width: 200 }}>Name</TableCell>
                    <TableCell sx={{ width: 150 }}>Category</TableCell>
                    <TableCell sx={{ width: 120, textAlign: "right" }}>
                      Price
                    </TableCell>
                    <TableCell sx={{ width: 100 }}>Type</TableCell>
                    <TableCell sx={{ width: 100 }}>Cuisine</TableCell>
                    <TableCell sx={{ width: 140 }}>Status</TableCell>
                    <TableCell sx={{ width: 80 }}>Active</TableCell>
                    <TableCell sx={{ width: 120 }}>Display Order</TableCell>
                    <TableCell sx={{ width: 120 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 4 }}
                        >
                          No items found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        <TableCell>{item.id}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" noWrap title={item.name}>
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              item.category?.name ||
                              item.category?.id ||
                              "Uncategorized"
                            }
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          ₹{item.basePrice?.toFixed(2) ?? 0}
                        </TableCell>
                        <TableCell>{item.type || "Regular"}</TableCell>
                        <TableCell sx={{ maxWidth: 100 }}>
                          <Typography
                            variant="body2"
                            noWrap
                            title={item.cuisine}
                          >
                            {item.cuisine || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              (item.isAvailable ?? item.active)
                                ? "Available"
                                : "Unavailable"
                            }
                            size="small"
                            color={
                              (item.isAvailable ?? item.active)
                                ? "success"
                                : "error"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.active ? "Yes" : "No"}
                            size="small"
                            color={item.active ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>{item.displayOrder || 0}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton
                              component={Link}
                              href={`/catalog/items/${item.id}`}
                              size="small"
                              title="View"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              component={Link}
                              href={`/catalog/items/${item.id}/edit`}
                              color="primary"
                              size="small"
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteOpen(item.id, item.name)
                              }
                              title="Delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={Array.isArray(filteredItems) ? filteredItems.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "
            {deleteDialog.open ? deleteDialog.itemName : ""}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            autoFocus
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      <PageFooter backHref="/catalog" backText="Back to Catalog" />
    </Box>
  );
}
