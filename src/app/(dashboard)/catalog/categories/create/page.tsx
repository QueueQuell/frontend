"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Paper, CircularProgress } from "@mui/material";
import SnackbarAlert from "@/components/ui/SnackbarAlert";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Category name is required",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setSnackbar({ open: false, message: "", severity: "success" });

    try {
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
        message: err.message || "Failed to create category. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Items", href: "/catalog" },
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

      <Paper sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
        <form onSubmit={handleSubmit}>
          <CategoryForm formData={formData} onChange={handleChange} />
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              component={Link}
              href="/catalog/categories/list"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
              }
            >
              {isSubmitting ? "Creating..." : "Create Category"}
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
