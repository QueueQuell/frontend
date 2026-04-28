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
import { menuService } from "@/lib/api/services/menu.service";
import { categoryService } from "@/lib/api/services/category.service";
import type { MenuItemType } from "@/lib/api/types";

export default function ItemEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    categoryId: "",
    organisationId: "",
    description: "",
    imageUrls: [],
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
        setFormData({
          name: data.name || "",
          categoryId: data.category?.id || data.category?.name || "",
          organisationId: "",
          description: data.description || "",
          imageUrls: data.imageUrls || [],
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
        });
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

  const handleChange = (field: keyof ItemFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

      const payload: any = {
        name: formData.name,
        description: formData.description || undefined,
        category: categoryName,
        categoryId: formData.categoryId,
        type: formData.type || undefined,
        cuisine: formData.cuisine || undefined,
        spicinessLevel: formData.spicinessLevel || undefined,
        pricingModel: formData.pricingModel,
        price: parseFloat(formData.basePrice),
        basePrice: parseFloat(formData.basePrice),
        currency: formData.currency || undefined,
        preparationTime: formData.preparationTime
          ? parseInt(formData.preparationTime)
          : undefined,
        allergens: formData.allergens,
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        isGlutenFree: formData.isGlutenFree,
        nonVeg: !formData.isVegetarian,
        active: formData.active,
        status: formData.status,
        isRecommended: formData.isRecommended,
        isPopular: formData.isPopular,
        dietaryTags: formData.dietaryTags,
        imageUrl: formData.imageUrls?.[0]?.url || undefined,
        displayOrder: formData.displayOrder
          ? parseInt(formData.displayOrder)
          : undefined,
        variantGroups: formData.variantGroups.map((group) => ({
          name: group.name,
          isRequired: group.isRequired,
          selectionType: group.selectionType,
          options: group.options.map((option) => ({
            name: option.name,
            price: parseFloat(option.price) || 0,
            calories: parseFloat(option.calories) || 0,
          })),
        })),
        addonGroups: formData.addonGroups.map((group) => ({
          name: group.name,
          selectionType: group.selectionType,
          options: group.options.map((option) => ({
            name: option.name,
            price: parseFloat(option.price) || 0,
          })),
        })),
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
        availability: {
          days: formData.availability.days,
          startTime: formData.availability.startTime || "11:00",
          endTime: formData.availability.endTime || "22:00",
        },
      };

      const response = await menuService.update(id, payload);

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
