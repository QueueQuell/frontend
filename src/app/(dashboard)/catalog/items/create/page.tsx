"use client";
import { Box, Button, Alert, Paper } from "@mui/material";
import Link from "next/link";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import ItemForm, { ItemFormData } from "@/components/items/ItemForm";
import { menuService } from "@/lib/api/services/menu.service";
import { categoryService } from "@/lib/api/services/category.service";

export default function CreateItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    categoryId: "",
    organisationId: "",
    description: "",
    images: [],
    cuisine: "",
    type: "",
    spicinessLevel: "",
    preparationTime: "",
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    dietaryTags: [],
    pricingModel: "SinglePrice",
    basePrice: "",
    currency: "INR",
    variantGroups: [],
    addonGroups: [],
    components: [],
    nutritionalInfo: {
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      sugar: "",
    },
    availability: {
      days: [],
      startTime: "",
      endTime: "",
    },
    status: "Available",
    active: true,
    isRecommended: false,
    isPopular: false,
    displayOrder: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.success && response.data) {
          // Only store categoryId and name
          setCategories(
            response.data.map((cat: { id: string; name: string }) => ({
              id: cat.id,
              name: cat.name,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
    if (!formData.categoryId) {
      setError("Category is required");
      return;
    }
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      setError("Valid price is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Build the API payload
      const payload: any = {
        name: formData.name,
        description: formData.description,
        images: formData.images,
        cuisine: formData.cuisine,
        type: formData.type,
        spicinessLevel: formData.spicinessLevel,
        preparationTime: formData.preparationTime
          ? parseInt(formData.preparationTime)
          : undefined,
        allergens: formData.allergens,
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        isGlutenFree: formData.isGlutenFree,
        dietaryTags: formData.dietaryTags,
        pricingModel: formData.pricingModel,
        basePrice: parseFloat(formData.basePrice),
        currency: formData.currency,
        variantGroups: formData.variantGroups,
        addonGroups: formData.addonGroups,
        components: formData.components.map((c) => ({
          itemId: c.itemId,
          quantity: parseInt(c.quantity) || 1,
          isOptional: c.isOptional,
        })),
        nutritionalInfo: {
          calories: parseInt(formData.nutritionalInfo.calories) || 0,
          protein: parseInt(formData.nutritionalInfo.protein) || 0,
          carbs: parseInt(formData.nutritionalInfo.carbs) || 0,
          fat: parseInt(formData.nutritionalInfo.fat) || 0,
          sugar: parseInt(formData.nutritionalInfo.sugar) || 0,
        },
        availability:
          formData.availability.days.length > 0
            ? {
                days: formData.availability.days,
                startTime: formData.availability.startTime || "11:00",
                endTime: formData.availability.endTime || "22:00",
              }
            : undefined,
        status: formData.status,
        active: formData.active,
        isRecommended: formData.isRecommended,
        isPopular: formData.isPopular,
        displayOrder: formData.displayOrder
          ? parseInt(formData.displayOrder)
          : undefined,
        categoryId: formData.categoryId,
      };

      // Add optional fields if they have values
      if (formData.displayOrder) {
        payload.displayOrder = parseInt(formData.displayOrder);
      }
      if (formData.variantGroups && formData.variantGroups.length > 0) {
        payload.variantGroups = formData.variantGroups;
      }
      if (formData.addonGroups && formData.addonGroups.length > 0) {
        payload.addonGroups = formData.addonGroups;
      }
      if (formData.components && formData.components.length > 0) {
        payload.components = formData.components.map((c) => ({
          itemId: c.itemId,
          quantity: parseInt(c.quantity) || 1,
          isOptional: c.isOptional,
        }));
      }
      if (
        formData.nutritionalInfo &&
        (formData.nutritionalInfo.calories ||
          formData.nutritionalInfo.protein ||
          formData.nutritionalInfo.carbs ||
          formData.nutritionalInfo.fat ||
          formData.nutritionalInfo.sugar)
      ) {
        payload.nutritionalInfo = {
          calories: parseInt(formData.nutritionalInfo.calories) || 0,
          protein: parseInt(formData.nutritionalInfo.protein) || 0,
          carbs: parseInt(formData.nutritionalInfo.carbs) || 0,
          fat: parseInt(formData.nutritionalInfo.fat) || 0,
          sugar: parseInt(formData.nutritionalInfo.sugar) || 0,
        };
      }
      if (formData.availability && formData.availability.days.length > 0) {
        payload.availability = {
          days: formData.availability.days,
          startTime: formData.availability.startTime || "11:00",
          endTime: formData.availability.endTime || "22:00",
        };
      }

      // Call the menu service to create the item
      const response = await menuService.create(payload);

      if (response.success) {
        setSuccess(true);
        setFormData({
          name: "",
          categoryId: "",
          organisationId: "",
          description: "",
          images: [],
          cuisine: "",
          type: "",
          spicinessLevel: "",
          preparationTime: "",
          allergens: [],
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          dietaryTags: [],
          pricingModel: "SinglePrice",
          basePrice: "",
          currency: "INR",
          variantGroups: [],
          addonGroups: [],
          components: [],
          nutritionalInfo: {
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            sugar: "",
          },
          availability: {
            days: [],
            startTime: "",
            endTime: "",
          },
          status: "Available",
          active: true,
          isRecommended: false,
          isPopular: false,
          displayOrder: "",
        });

        setTimeout(() => {
          setSuccess(false);
          router.push("/catalog/items/list");
        }, 2000);
      } else {
        setError(response.error || "Failed to create item. Please try again.");
      }
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
          { label: "Catalog", href: "/catalog" },
          { label: "Items", href: "/catalog/items/list" },
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

      <Paper sx={{ p: 4, mx: "auto" }}>
        <form onSubmit={handleSubmit}>
          <ItemForm
            formData={formData}
            onChange={handleChange}
            categories={categories}
          />
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              component={Link}
              href="/catalog/items/list"
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

      <PageFooter backHref="/catalog/items/list" backText="Back to Items" />
    </Box>
  );
}
