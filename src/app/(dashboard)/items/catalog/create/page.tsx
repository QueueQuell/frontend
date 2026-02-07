"use client";
import { Box, Button, Alert, Paper } from "@mui/material";
import Link from "next/link";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import ItemForm, { ItemFormData } from "@/components/items/ItemForm";

export default function CreateItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    category: "",
    price: "",
    imageUrl: "",
    description: "",
    displayOrder: "",
    tags: "",
    availabilityDays: [],
    availabilityTimeSlots: "",
    spicyLevel: "",
    featured: false,
    recommended: false,
    specialInstructions: "",
    preparationTime: "",
    cuisine: "",
    extraOptions: [],
    sectionId: "",
    active: true,
    additionalInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof ItemFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setError("Item name is required");
      return;
    }
    if (!formData.category) {
      setError("Category is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await api.createItem(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setFormData({
        name: "",
        category: "",
        price: "",
        imageUrl: "",
        description: "",
        displayOrder: "",
        tags: "",
        availabilityDays: [],
        availabilityTimeSlots: "",
        spicyLevel: "",
        featured: false,
        recommended: false,
        specialInstructions: "",
        preparationTime: "",
        cuisine: "",
        extraOptions: [],
        sectionId: "",
        active: true,
        additionalInfo: "",
      });

      setTimeout(() => {
        setSuccess(false);
        router.push("/items/catalog");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Items", href: "/items" },
          { label: "Catalog", href: "/items/catalog" },
          { label: "Create New Menu Item" },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Item added successfully! Redirecting to catalog...
        </Alert>
      )}

      <Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <form onSubmit={handleSubmit}>
          <ItemForm formData={formData} onChange={handleChange} />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
            <Button
              component={Link}
              href="/items/catalog"
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
              startIcon={<RestaurantMenuIcon />}
            >
              {isSubmitting ? "Creating..." : "Create Item"}
            </Button>
          </Box>
        </form>
      </Paper>

      <PageFooter backHref="/items/catalog" backText="Back to Catalog" />
    </Box>
  );
}

