"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Switch,
  Stack,
  Paper,
} from "@mui/material";
import ItemForm, { ItemFormData } from "@/components/items/ItemForm";
import { categoryService } from "@/lib/api/services/category.service";
import type { MenuItemType } from "@/lib/api/types";
import MenuItemCard from "@/components/menu/MenuItemCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageFooter from "@/components/ui/PageFooter";
import { menuService } from "@/lib/api/services/menu.service";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<MenuItemType | null>(null);
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
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false); // unused but kept
  // Removed unused toggleDialog

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
      setError(null);
      const response = await menuService.getById(id);
      if (response.success && response.data) {
        const data = response.data as MenuItemType;
        setItem(data);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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

  if (error || !item) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Item not found"}</Alert>
        <PageFooter
          backHref="/catalog/items/list"
          backText="Back to Items List"
        />
      </Box>
    );
  }

  const title = item.name;

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Catalog", href: "/catalog" },
          { label: "Items", href: "/catalog/items/list" },
          { label: title },
        ]}
      />

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button
          component={Link}
          href="/catalog/items/list"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Back to List
        </Button>
        <Button
          component={Link}
          href={`/catalog/items/${id}/edit`}
          variant="contained"
          startIcon={<EditIcon />}
        >
          Edit Item
        </Button>
      </Box>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Basic Information
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Name
            </Typography>
            <Typography variant="body1">{item.name}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Category
            </Typography>
            <Typography variant="body1">
              {item.category?.name || item.category?.id || "N/A"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Price
            </Typography>
            <Typography variant="body1">
              ₹{item.basePrice?.toFixed(2) ?? 0}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Status
            </Typography>
            <Chip
              label={item.active ? "Active" : "Inactive"}
              color={item.active ? "success" : "error"}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Description
            </Typography>
            <Typography variant="body2">
              {item.description || "No description"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Type
            </Typography>
            <Typography variant="body1">{item.type || "N/A"}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Preview as Customer Sees (Menu Card)
        </Typography>
        <Box sx={{ maxWidth: 400 }}>
          <MenuItemCard
            item={{
              ...item,
              category:
                item.category?.name || item.category?.id || "Uncategorized",
              description: item.description || "",
              weight: "250g",
              image:
                item.imageUrls?.[0]?.url ||
                item.imageUrl ||
                "/placeholder-menu.jpg",
              price: item.basePrice,
              isVeg: item.isVegetarian ?? false,
              addons: [],
            }}
            onViewDetails={() => {}}
          />
        </Box>
      </Paper>

      <PageFooter
        backHref="/catalog/items/list"
        backText="Back to Items List"
      />
    </Box>
  );
}
