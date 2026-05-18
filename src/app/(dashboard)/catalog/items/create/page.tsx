"use client";
import { Box, Button, Paper } from "@mui/material";
import SnackbarAlert from "@/components/ui/SnackbarAlert";

import Link from "next/link";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import ItemForm from "@/components/items/ItemForm";
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

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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

  const compressImageFile = async (file: File) => {
    // Simple client-side compression using canvas.
    // Keeps aspect ratio, outputs JPEG (quality 0.75) to reduce payload size.
    // If anything fails, fall back to original file.
    try {
      if (!file.type.startsWith("image/")) return file;

      const MAX_WIDTH = 1280;
      const MIME_TYPE = "image/jpeg";
      const QUALITY = 0.75;

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };
        image.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e);
        };
        image.src = url;
      });

      const { width, height } = img;
      if (!width || !height) return file;

      const scale = Math.min(1, MAX_WIDTH / width);
      const targetW = Math.round(width * scale);
      const targetH = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;

      ctx.drawImage(img, 0, 0, targetW, targetH);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), MIME_TYPE, QUALITY);
      });

      if (!blob) return file;

      return new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
        type: MIME_TYPE,
      });
    } catch {
      return file;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation

    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Item name is required",
        severity: "error",
      });
      return;
    }
    if (!formData.categoryId) {
      setSnackbar({
        open: true,
        message: "Category is required",
        severity: "error",
      });
      return;
    }
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      setSnackbar({
        open: true,
        message: "Valid price is required",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

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

      // Append (compressed) files
      const compressedFiles: File[] = [];
      for (const file of files) {
        const compressed = await compressImageFile(file);
        compressedFiles.push(compressed);
      }

      compressedFiles.forEach((file) => {
        formDataSubmit.append("images", file);
      });

      // Call menu service
      const response = await menuService.createWithFiles(formDataSubmit);

      if (response.success) {
        setSnackbar({
          open: true,
          message: "Item added successfully! Redirecting to catalog...",
          severity: "success",
        });

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
          router.push("/catalog/items/list");
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: response.error || "Failed to create item. Please try again.",
          severity: "error",
        });
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message,
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
          { label: "Catalog", href: "/catalog" },
          { label: "Items", href: "/catalog/items/list" },
          { label: "Create New Menu Item" },
        ]}
      />

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

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
