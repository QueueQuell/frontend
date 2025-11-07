"use client";
import CommonLayout from "../../components/layouts/CommonLayout";
import { Typography, Box, Paper, Grid, Button, Chip, IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Link from "next/link";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";

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
  const [addDialog, setAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayOrder: "",
    isActive: true,
    color: "#1976d2",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await api.createCategory(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        displayOrder: parseInt(formData.displayOrder) || categories.length + 1,
        isActive: formData.isActive,
        color: formData.color,
        itemCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCategories(prev => [...prev, newCategory]);
      setSuccess(true);
      setFormData({
        name: "",
        description: "",
        displayOrder: "",
        isActive: true,
        color: "#1976d2",
      });
      setAddDialog(false);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <CommonLayout>
        <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Menu Categories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Organize your menu items into categories for better customer experience
            </Typography>
          </Box>
          <Button
            onClick={() => setAddDialog(true)}
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
                      <IconButton size="small" color="primary">
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

        {/* Add Category Dialog */}
        <Dialog
          open={addDialog}
          onClose={() => setAddDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Category</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Category Name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g., Appetizers, Main Courses, Desserts"
                      helperText="Enter a descriptive name for the category"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Optional description for the category"
                      helperText="Provide additional context about this category"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Display Order"
                      value={formData.displayOrder}
                      onChange={(e) => handleChange("displayOrder", e.target.value)}
                      placeholder="1"
                      helperText="Order in which categories appear (lower numbers first)"
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.isActive ? "true" : "false"}
                        label="Status"
                        onChange={(e) => handleChange("isActive", e.target.value === "true")}
                      >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Category Color"
                      value={formData.color}
                      onChange={(e) => handleChange("color", e.target.value)}
                      helperText="Choose a color to represent this category"
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting}
              startIcon={<CategoryIcon />}
            >
              {isSubmitting ? "Creating..." : "Create Category"}
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 3 }}>
          <Button component={Link} href="/items" variant="outlined">
            ← Back to Items
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
