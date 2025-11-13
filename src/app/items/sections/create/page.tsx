"use client";
import CommonLayout from "../../../components/layouts/CommonLayout";
import { Box, Button, Alert, Paper } from "@mui/material";
import Link from "next/link";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/ui/PageHeader";
import PageFooter from "@/app/components/ui/PageFooter";
import SectionForm, { SectionFormData } from "@/app/components/section/SectionForm";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SectionFormData>({
    name: "",
    description: "",
    displayOrder: "",
    isActive: true,
    color: "#1976d2",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof SectionFormData, value: any) => {
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
      // TODO: Replace with actual API call
      // const response = await api.createCategory(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        router.push("/items/categories");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Create New Category"
          description="Add a new category to organize your menu items"
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
            <SectionForm formData={formData} onChange={handleChange} />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
              <Button
                component={Link}
                href="/items/categories"
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
                startIcon={<CategoryIcon />}
              >
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </Box>
          </form>
        </Paper>

        <PageFooter backHref="/items/categories" backText="Back to Categories" />
      </Box>
    </CommonLayout>
  );
}

