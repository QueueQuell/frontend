"use client";
import { Typography, Box, Paper, Grid, Button, Chip, IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import { useState, useEffect } from "react";
import SectionForm, { SectionFormData } from "@/components/section/SectionForm";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";

interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  color: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  });
  const [editDialog, setEditDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  });
  const [formData, setFormData] = useState<SectionFormData>({
    name: "",
    description: "",
    displayOrder: "",
    isActive: true,
    color: "#1976d2",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const data = await api.getCategories();

        // Mock data
        const mockCategories: Category[] = [
          {
            id: "1",
            name: "Appetizers",
            description: "Small dishes served before main course",
            displayOrder: 1,
            isActive: true,
            color: "#4caf50",
            itemCount: 12,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
          },
          {
            id: "2",
            name: "Main Courses",
            description: "Primary dishes and entrees",
            displayOrder: 2,
            isActive: true,
            color: "#2196f3",
            itemCount: 25,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
          },
          {
            id: "3",
            name: "Desserts",
            description: "Sweet dishes served after main course",
            displayOrder: 3,
            isActive: true,
            color: "#ff9800",
            itemCount: 8,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
          },
          {
            id: "4",
            name: "Beverages",
            description: "Drinks and refreshments",
            displayOrder: 4,
            isActive: true,
            color: "#9c27b0",
            itemCount: 15,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
          },
        ];

        setCategories(mockCategories);
      } catch (err: any) {
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (category: Category) => {
    try {
      // TODO: Replace with actual API call
      // await api.deleteCategory(category.id);

      // Mock deletion
      setCategories(prev => prev.filter(c => c.id !== category.id));
      setDeleteDialog({ open: false, category: null });
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    }
  };

  const handleEditClick = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      displayOrder: category.displayOrder.toString(),
      isActive: category.isActive,
      color: category.color,
    });
    setEditDialog({ open: true, category });
  };

  const handleChange = (field: keyof SectionFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    if (!editDialog.category) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await api.updateCategory(editDialog.category.id, formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock update
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editDialog.category!.id
            ? {
              ...c,
              name: formData.name,
              description: formData.description,
              displayOrder: parseInt(formData.displayOrder) || c.displayOrder,
              isActive: formData.isActive,
              color: formData.color,
              updatedAt: new Date().toISOString(),
            }
            : c
        )
      );

      setEditDialog({ open: false, category: null });
      setFormData({
        name: "",
        description: "",
        displayOrder: "",
        isActive: true,
        color: "#1976d2",
      });
    } catch (err: any) {
      setError(err.message || "Failed to update category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Items", href: "/items" },
            { label: "Categories" },
          ]}
        />
        <Button
          component={Link}
          href="/items/categories/create"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Category
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              {categories.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Categories
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
              {categories.filter(c => c.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Categories
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
              {categories.reduce((sum, c) => sum + c.itemCount, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Items
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
              {categories.filter(c => !c.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inactive Categories
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Categories Table */}
      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Items</TableCell>
                <TableCell align="center">Order</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: category.color,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {category.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.description || "No description"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${category.itemCount} items`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {category.displayOrder}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={category.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={category.isActive ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditClick(category)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, category })}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Category Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, category: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <form onSubmit={handleEditSubmit}>
              <SectionForm formData={formData} onChange={handleChange} />
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialog({ open: false, category: null })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={isSubmitting}
            startIcon={<CategoryIcon />}
          >
            {isSubmitting ? "Updating..." : "Update Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, category: null })}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{deleteDialog.category?.name}"?
            This action cannot be undone and will affect {deleteDialog.category?.itemCount} items.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, category: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteDialog.category && handleDelete(deleteDialog.category)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <PageFooter backHref="/items" backText="Back to Items" />
    </Box>
  );
}
