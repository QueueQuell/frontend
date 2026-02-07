"use client";
import { Typography, Box, Grid, Card, CardContent, CardMedia, CardActions, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useState } from "react";
import ItemForm, { ItemFormData } from "@/components/items/ItemForm";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CommonLayout from "@/components/layouts/CommonLayout";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
}

const menuItems: MenuItem[] = [
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 12.99, image: "https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.webp", available: true },
  { id: 2, name: "Caesar Salad", category: "Salads", price: 8.99, image: "https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.webp", available: true },
  { id: 3, name: "Grilled Chicken", category: "Main Course", price: 15.99, image: "https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.webp", available: false },
  { id: 4, name: "Chocolate Cake", category: "Desserts", price: 6.99, image: "https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.webp", available: true },
];

export default function MenuCatalogPage() {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [editDialog, setEditDialog] = useState<{ open: boolean; item: MenuItem | null }>({
    open: false,
    item: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: MenuItem | null }>({
    open: false,
    item: null,
  });
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

  const handleEditClick = (item: MenuItem) => {
    setFormData({
      name: item.name,
      category: item.category.toLowerCase(),
      price: item.price.toString(),
      imageUrl: item.image,
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
      active: item.available,
      additionalInfo: "",
    });
    setEditDialog({ open: true, item });
  };

  const handleChange = (field: keyof ItemFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

    if (!editDialog.item) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await api.updateItem(editDialog.item.id, formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock update
      setItems((prev) =>
        prev.map((i) =>
          i.id === editDialog.item!.id
            ? {
              ...i,
              name: formData.name,
              category: formData.category,
              price: parseFloat(formData.price),
              image: formData.imageUrl || i.image,
              available: formData.active,
            }
            : i
        )
      );

      setEditDialog({ open: false, item: null });
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
    } catch (err: any) {
      setError(err.message || "Failed to update item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    try {
      // TODO: Replace with actual API call
      // await api.deleteItem(item.id);

      // Mock deletion
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setDeleteDialog({ open: false, item: null });
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    }
  };

  return (
    <CommonLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Items", href: "/items" },
              { label: "Catalog" },
            ]}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Button component={Link} href="/items/catalog/create" variant="contained" startIcon={<AddIcon />}>
              Add Item
            </Button>
          </Box>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt={item.name}
                  loading="lazy"
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.category}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{item.price}
                  </Typography>
                  <Chip
                    label={item.available ? "Available" : "Unavailable"}
                    color={item.available ? "success" : "error"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleEditClick(item)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, item })}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Edit Item Dialog */}
        <Dialog
          open={editDialog.open}
          onClose={() => setEditDialog({ open: false, item: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <form onSubmit={handleEditSubmit}>
                <ItemForm formData={formData} onChange={handleChange} />
              </form>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setEditDialog({ open: false, item: null })}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              variant="contained"
              disabled={isSubmitting}
              startIcon={<RestaurantMenuIcon />}
            >
              {isSubmitting ? "Updating..." : "Update Item"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, item: null })}
        >
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{deleteDialog.item?.name}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, item: null })}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialog.item && handleDelete(deleteDialog.item)}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <PageFooter backHref="/items" backText="Back to Items" />
      </Box>
    </CommonLayout>
  );
}
