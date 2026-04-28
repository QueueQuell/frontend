"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import SnackbarAlert from "@/components/ui/SnackbarAlert";
import CategoryForm, {
  CategoryFormData,
} from "@/components/category/CategoryForm";
import { categoryService } from "@/lib/api/services/category.service";

export default function CreateCategoryPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    displayOrder: "",
    isActive: true,
    color: "#1976d2",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name,
        description: formData.description || "",
        displayOrder: formData.displayOrder
          ? parseInt(formData.displayOrder as string)
          : 1,
      };

      const response = await categoryService.create(payload);

      if (response.success) {
        setSnackbar({
          open: true,
          message:
            "Category created successfully! Redirecting to categories...",
          severity: "success",
        });
        setTimeout(() => {
          router.push("/catalog/categories/list");
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Failed to create category",
          severity: "error",
        });
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to create category",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Catalog", href: "/catalog" },
          { label: "Categories", href: "/catalog/categories/list" },
          { label: "Create New Category" },
        ]}
      />

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Create Category
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <CategoryForm formData={formData} onChange={handleChange} />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              component={Link}
              href="/catalog/categories/list"
              disabled={saving}
              startIcon={<ArrowBackIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Category"}
            </Button>
          </Box>
        </form>
      </Paper>

      <PageFooter
        backHref="/catalog/categories/list"
        backText="Back to Categories"
      />
    </Box>
  );
}
