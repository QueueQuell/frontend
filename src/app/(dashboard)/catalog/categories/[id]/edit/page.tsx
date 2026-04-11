"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import CategoryForm from "@/components/category/CategoryForm";
import { categoryService } from "@/lib/api/services/category.service";
import type { UpdateCategoryRequest } from "@/lib/api/types";

export default function CategoryEditPage() {
  const router = useRouter();

  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayOrder: "",
    isActive: true,
    color: "#1976d2",
  });

  useEffect(() => {
    loadCategory();
  }, [params.id]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getById(id);
      if (response.success && response.data) {
        const data = response.data;
        setCategory(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          displayOrder: data.displayOrder?.toString() || "",
          isActive: data.active !== false, // default true
          color: "#1976d2",
        });
      } else {
        setError(response.message || "Category not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

      const payload: UpdateCategoryRequest = {
        name: formData.name,
        description: formData.description || "",
        displayOrder: formData.displayOrder
          ? parseInt(formData.displayOrder)
          : 1,
        active: formData.isActive,
      };

      const response = await categoryService.update(id, payload);

      if (response.success) {
        router.push(`/catalog/categories/${id}`);
        router.refresh(); // Refresh list page
      } else {
        setError(response.message || "Failed to update category");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Catalog", href: "/catalog" },
            { label: "Categories", href: "/catalog/categories" },
            { label: "Edit Category" },
          ]}
        />
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <PageFooter
          backHref="/catalog/categories"
          backText="Back to Categories"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Catalog", href: "/catalog" },
          { label: "Categories", href: "/catalog/categories" },
          { label: category?.name || "Edit Category" },
        ]}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                Edit Category
              </Typography>
              <Button
                component={Link}
                href={`/catalog/categories/${params.id}`}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
              >
                View Category
              </Button>
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
                  href="/catalog/categories"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update Category"}
                </Button>
              </Box>
            </form>
          </Paper>

          <PageFooter
            backHref="/catalog/categories"
            backText="Back to Categories"
          />
        </>
      )}
    </Box>
  );
}
