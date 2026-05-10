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
import type { ImageDto } from "@/types/menu.types";
import { menuService } from "@/lib/api/services/menu.service";
import { categoryService } from "@/lib/api/services/category.service";

export default function CreateItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    name: "",
    categoryId: "",
    organisationId: "",
    description: "",
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
  const [files, setFiles] = useState<File[]>([]);
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

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
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
      // Remove old payload code, use FormData only
      const formDataSubmit = new FormData();

      // Append form fields
      formDataSubmit.append("name", formData.name);
      if (formData.description)
        formDataSubmit.append("description", formData.description);
      formDataSubmit.append("categoryId", formData.categoryId);
      formDataSubmit.append("pricingModel", formData.pricingModel);
      formDataSubmit.append("basePrice", formData.basePrice);
      if (formData.currency)
        formDataSubmit.append("currency", formData.currency);
      if (formData.cuisine) formDataSubmit.append("cuisine", formData.cuisine);
      if (formData.type) formDataSubmit.append("type", formData.type);
      if (formData.spicinessLevel)
        formDataSubmit.append("spicinessLevel", formData.spicinessLevel);
      if (formData.preparationTime)
        formDataSubmit.append("preparationTime", formData.preparationTime);

      // Booleans
      formDataSubmit.append("isVegetarian", formData.isVegetarian.toString());
      formDataSubmit.append("isVegan", formData.isVegan.toString());
      formDataSubmit.append("isGlutenFree", formData.isGlutenFree.toString());
      formDataSubmit.append("active", formData.active.toString());
      formDataSubmit.append("isRecommended", formData.isRecommended.toString());
      formDataSubmit.append("isPopular", formData.isPopular.toString());

      // Arrays
      formData.allergens.forEach((allergen: any) =>
        formDataSubmit.append("allergens", allergen),
      );
      formData.dietaryTags.forEach((tag: any) =>
        formDataSubmit.append("dietaryTags", tag),
      );

      // Variant groups
      formData.variantGroups?.forEach((group: any, gIndex: number) => {
        formDataSubmit.append(`variantGroups[${gIndex}].name`, group.name);
        formDataSubmit.append(
          `variantGroups[${gIndex}].isRequired`,
          group.isRequired.toString(),
        );
        formDataSubmit.append(
          `variantGroups[${gIndex}].selectionType`,
          group.selectionType,
        );
        group.options?.forEach((option: any, oIndex: number) => {
          formDataSubmit.append(
            `variantGroups[${gIndex}].options[${oIndex}].name`,
            option.name,
          );
          if (option.price)
            formDataSubmit.append(
              `variantGroups[${gIndex}].options[${oIndex}].price`,
              option.price,
            );
          if (option.calories)
            formDataSubmit.append(
              `variantGroups[${gIndex}].options[${oIndex}].calories`,
              option.calories,
            );
        });
      });

      // Addon groups
      formData.addonGroups?.forEach((group: any, gIndex: number) => {
        formDataSubmit.append(`addonGroups[${gIndex}].name`, group.name);
        formDataSubmit.append(
          `addonGroups[${gIndex}].selectionType`,
          group.selectionType,
        );
        group.options?.forEach((option: any, oIndex: number) => {
          formDataSubmit.append(
            `addonGroups[${gIndex}].options[${oIndex}].name`,
            option.name,
          );
          if (option.price)
            formDataSubmit.append(
              `addonGroups[${gIndex}].options[${oIndex}].price`,
              option.price,
            );
        });
      });

      // Components
      formData.components?.forEach((comp: any, index: number) => {
        formDataSubmit.append(`components[${index}].itemId`, comp.itemId);
        formDataSubmit.append(`components[${index}].quantity`, comp.quantity);
        formDataSubmit.append(
          `components[${index}].isOptional`,
          comp.isOptional.toString(),
        );
      });

      // Nutritional info
      const hasNutrition = Object.values(formData.nutritionalInfo).some(
        (val: any) => val !== "",
      );
      if (hasNutrition) {
        formDataSubmit.append(
          "nutritionalInfo.calories",
          formData.nutritionalInfo.calories,
        );
        formDataSubmit.append(
          "nutritionalInfo.protein",
          formData.nutritionalInfo.protein,
        );
        formDataSubmit.append(
          "nutritionalInfo.carbs",
          formData.nutritionalInfo.carbs,
        );
        formDataSubmit.append(
          "nutritionalInfo.fat",
          formData.nutritionalInfo.fat,
        );
        formDataSubmit.append(
          "nutritionalInfo.sugar",
          formData.nutritionalInfo.sugar,
        );
      }

      // Availability
      if (formData.availability.days && formData.availability.days.length > 0) {
        (formData.availability.days as string[]).forEach((day) =>
          formDataSubmit.append("availability.days", day),
        );
        if (formData.availability.startTime)
          formDataSubmit.append(
            "availability.startTime",
            formData.availability.startTime,
          );
        if (formData.availability.endTime)
          formDataSubmit.append(
            "availability.endTime",
            formData.availability.endTime,
          );
      }

      if (formData.displayOrder)
        formDataSubmit.append("displayOrder", formData.displayOrder);
      formDataSubmit.append("status", formData.status);

      // Append files
      files.forEach((file) => {
        formDataSubmit.append("images", file);
      });

      // Call menu service
      const response = await menuService.createWithFiles(formDataSubmit);

      if (response.success) {
        setSuccess(true);
        setFormData({
          name: "",
          categoryId: "",
          organisationId: "",
          description: "",
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
        setFiles([]);

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
            files={files}
            onFilesChange={handleFilesChange}
            existingImages={[]}
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
