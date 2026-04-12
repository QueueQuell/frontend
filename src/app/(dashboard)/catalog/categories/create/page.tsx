"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Alert, Paper, CircularProgress } from "@mui/material";
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      const payload = {
        name: formData.name,
        description: formData.description || "",
        displayOrder: formData.displayOrder
          ? parseInt(formData.displayOrder as string)
          : 1,
      };

      const response = await categoryService.create(payload);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          router.push("/catalog/categories/list");
        }, 2000);
      } else {
        setError(response.message || "Failed to create category");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create category. Please try again.");
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Category created successfully! Redirecting to categories...
        </Alert>
      )}

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
