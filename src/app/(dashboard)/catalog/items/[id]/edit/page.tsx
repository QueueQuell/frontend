"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Alert, Paper, CircularProgress } from "@mui/material";
import Link from "next/link";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import ItemForm, { ItemFormData } from "@/components/items/ItemForm";
import type { ImageDto } from "@/types/menu.types";
import { menuService } from "@/lib/api/services/menu.service";
import { categoryService } from "@/lib/api/services/category.service";
import type { MenuItemType } from "@/lib/api/types";

export default function ItemEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState<Omit<ItemFormData, "images">>({
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
  const [existingImages, setExistingImages] = useState<ImageDto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success && response.data) {
        setCategories(
          response.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await menuService.getById(id);
      if (response.success && response.data) {
        const data = response.data as MenuItemType;
        const newFormData: Omit<ItemFormData, "images"> = {
          name: data.name || "",
          categoryId: data.category?.id || data.category?.name || "",
          organisationId: "",
          description: data.description || "",
          cuisine: data.cuisine || "",
          type: data.type || "",
          spicinessLevel: data.spicinessLevel || "",
          preparationTime: data.preparationTime?.toString() || "",
          allergens: data.allergens || [],
          isVegetarian: data.isVegetarian ?? false,
          isVegan: data.isVegan ?? false,
          isGlutenFree: data.isGlutenFree ?? false,
          dietaryTags: data.dietaryTags || [],
          pricingModel: data.pricingModel || "SinglePrice",
          basePrice: data.basePrice?.toString() || "",
          currency: data.currency || "INR",
          variantGroups:
            data.variantGroups?.map((group) => ({
              name: group.name,
              isRequired: group.isRequired,
              selectionType: group.selectionType,
              options:
                group.options?.map((option) => ({
                  name: option.name,
                  price: option.price?.toString() || "",
                  calories: option.calories?.toString() || "",
                })) || [],
            })) || [],
          addonGroups:
            data.addonGroups?.map((group) => ({
              name: group.name,
              selectionType: group.selectionType,
              options:
                group.options?.map((option) => ({
                  name: option.name,
                  price: option.price?.toString() || "",
                })) || [],
            })) || [],
          components:
            data.components?.map((component) => ({
              itemId: component.itemId,
              quantity: component.quantity?.toString() || "",
              isOptional: component.isOptional,
            })) || [],
          nutritionalInfo: {
            calories: data.nutritionalInfo?.calories?.toString() || "",
            protein: data.nutritionalInfo?.protein?.toString() || "",
            carbs: data.nutritionalInfo?.carbs?.toString() || "",
            fat: data.nutritionalInfo?.fat?.toString() || "",
            sugar: data.nutritionalInfo?.sugar?.toString() || "",
          },
          availability: {
            days: data.availability?.days || [],
            startTime: data.availability?.startTime || "",
            endTime: data.availability?.endTime || "",
          },
          status:
            data.status || (data.isAvailable ? "Available" : "Out of Stock"),
          active: data.active ?? true,
          isRecommended: data.isRecommended ?? false,
          isPopular: data.isPopular ?? false,
          displayOrder: data.displayOrder?.toString() || "",
        };
        setFormData(newFormData);
        setExistingImages(data.imageUrls || []);
        console.log(data.imageUrls);
        setFiles([]);
      } else {
        setError(response.message || "Item not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch item");
    } finally {
      setLoading(false);
      fetchCategories();
    }
  };

  const handleChange = (
    field: keyof Omit<ItemFormData, "images">,
    value: any,
  ) => {
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
      const categoryName =
        categories.find((cat) => cat.id === formData.categoryId)?.name ||
        formData.categoryId;

      // Build FormData (same as create)
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
      formData.allergens.forEach((allergen: string) =>
        formDataSubmit.append("allergens", allergen),
      );
      formData.dietaryTags.forEach((tag: string) =>
        formDataSubmit.append("dietaryTags", tag),
      );

      // Nested objects (same as create)
      if (formData.variantGroups.length > 0) {
        formData.variantGroups.forEach((group, gIndex) => {
          formDataSubmit.append(`variantGroups[${gIndex}].name`, group.name);
          formDataSubmit.append(
            `variantGroups[${gIndex}].isRequired`,
            group.isRequired.toString(),
          );
          formDataSubmit.append(
            `variantGroups[${gIndex}].selectionType`,
            group.selectionType,
          );
          group.options.forEach((option, oIndex) => {
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
      }

      if (formData.addonGroups.length > 0) {
        formData.addonGroups.forEach((group, gIndex) => {
          formDataSubmit.append(`addonGroups[${gIndex}].name`, group.name);
          formDataSubmit.append(
            `addonGroups[${gIndex}].selectionType`,
            group.selectionType,
          );
          group.options.forEach((option, oIndex) => {
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
      }

      if (formData.components.length > 0) {
        formData.components.forEach((comp, index) => {
          formDataSubmit.append(`components[${index}].itemId`, comp.itemId);
          formDataSubmit.append(`components[${index}].quantity`, comp.quantity);
          formDataSubmit.append(
            `components[${index}].isOptional`,
            comp.isOptional.toString(),
          );
        });
      }

      // Nutritional info
      const hasNutrition = Object.values(formData.nutritionalInfo).some(
        (val) => val !== "",
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
      if (formData.availability.days.length > 0) {
        formData.availability.days.forEach((day: string) =>
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

      // Append files (new uploads)
      files.forEach((file) => {
        formDataSubmit.append("images", file);
      });

      // Call service
      const response = await menuService.updateWithFiles(id, formDataSubmit);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          router.push(`/catalog/items/${id}`);
        }, 2000);
      } else {
        setError(response.error || "Failed to update item. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{ p: 3, display: "flex", justifyContent: "center", minHeight: 400 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Catalog", href: "/catalog" },
          { label: "Items", href: "/catalog/items/list" },
          { label: "Edit Item" },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Item updated successfully! Redirecting...
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
            existingImages={existingImages}
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
              {isSubmitting ? "Updating..." : "Update Item"}
            </Button>
          </Box>
        </form>
      </Paper>

      <PageFooter backHref="/catalog/items/list" backText="Back to Items" />
    </Box>
  );
}
