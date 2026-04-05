"use client";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Switch,
  Card,
  CardMedia,
  CardContent,
  TextField,
  MenuItem,
  Stack,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useState, useEffect } from "react";
import ItemForm, { ItemFormData } from "@/components/items/ItemForm";
import PageFooter from "@/components/ui/PageFooter";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { menuService } from "@/lib/api/services/menu.service";

interface ApiMenuItem {
  _id: string;
  name: string;
  description?: string;
  category: string;
  categoryId?: string;
  type?: string;
  spicinessLevel?: string;
  dietaryTags?: string[];
  pricingModel?: string;
  basePrice: number;
  active: boolean;
  currency?: string;
  status?: string;
  isRecommended?: boolean;
  isPopular?: boolean;
  imageUrl?: string;
  restaurantId?: string;
  variantGroups?: any[];
  addonGroups?: any[];
  components?: any[];
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  available: boolean;
  description?: string;
  type?: string;
  imageUrl?: string;
}

export default function MenuCatalogPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    item: MenuItem | null;
  }>({
    open: false,
    item: null,
  });
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    item: MenuItem | null;
  }>({
    open: false,
    item: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: MenuItem | null;
  }>({
    open: false,
    item: null,
  });
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    categoryId: "",
    description: "",
    nonVeg: false,
    type: "",
    cuisine: "",
    spicinessLevel: "",
    pricingModel: "",
    basePrice: "",
    active: true,
    status: "",
    isRecommended: false,
    isPopular: false,
    displayOrder: "",
    dietaryTags: [],
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
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Get unique categories from items
  const categories = Array.from(
    new Set(items.map((item) => item.category)),
  ).sort();

  // Filter items based on search query, category, and status
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === "" || item.category === categoryFilter;

    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "available" && item.available) ||
      (statusFilter === "unavailable" && !item.available);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const hasActiveFilters =
    searchQuery !== "" || categoryFilter !== "" || statusFilter !== "";

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuService.getAll();

      if (response.success && response.data) {
        const apiItems = response.data as unknown as ApiMenuItem[];
        const mappedItems: MenuItem[] = apiItems.map((item) => ({
          id: item._id,
          name: item.name,
          category: item.category || item.type || "Uncategorized",
          categoryId: item.categoryId,
          price: item.basePrice,
          available: item.active,
          description: item.description,
          type: item.type,
          imageUrl: item.imageUrl
            ? item.imageUrl
            : "https://via.placeholder.com/300x180?text=Menu+Item",
        }));
        setItems(mappedItems);
      } else {
        setError(response.error || "Failed to fetch items");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setFormData({
      name: item.name,
      categoryId: item.categoryId || item.category.toLowerCase(),
      basePrice: item.price.toString(),
      imageUrl: item.imageUrl || "",
      description: item.description || "",
      displayOrder: "",
      dietaryTags: [],
      spicinessLevel: "",
      isRecommended: false,
      isPopular: false,
      cuisine: "",
      type: item.type || "",
      pricingModel: "",
      status: "",
      active: item.available,
      nonVeg: false,
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
    });
    setEditDialog({ open: true, item });
  };

  const handleViewClick = (item: MenuItem) => {
    setViewDialog({ open: true, item });
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
    if (!formData.categoryId) {
      setError("Category is required");
      return;
    }
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      setError("Valid price is required");
      return;
    }

    if (!editDialog.item) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await menuService.update(editDialog.item.id, {
        name: formData.name,
        categoryId: formData.categoryId,
        basePrice: parseFloat(formData.basePrice),
        description: formData.description,
        imageUrl: formData.imageUrl,
        active: formData.active,
        status: "Available",
      });

      await fetchItems();

      setEditDialog({ open: false, item: null });
      setFormData({
        name: "",
        categoryId: "",
        description: "",
        nonVeg: false,
        type: "",
        cuisine: "",
        spicinessLevel: "",
        pricingModel: "",
        basePrice: "",
        active: true,
        status: "",
        isRecommended: false,
        isPopular: false,
        displayOrder: "",
        dietaryTags: [],
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
        imageUrl: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to update item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    try {
      await menuService.delete(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setDeleteDialog({ open: false, item: null });
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    }
  };

  const handleToggleActive = async (item: MenuItem) => {
    try {
      await menuService.update(item.id, {
        active: !item.available,
      });
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, available: !i.available } : i,
        ),
      );
    } catch (err: any) {
      setError(err.message || "Failed to update item status");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Items", href: "/catalog" },
            { label: "Items" },
          ]}
        />
        <Button
          component={Link}
          href="/catalog/items/create"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Item
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
          </TextField>
          {hasActiveFilters && (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {filteredItems.length} of {items.length} items
          </Typography>
        </Stack>
      </Paper>

      {filteredItems.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <RestaurantMenuIcon
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            No items found
          </Typography>
          <Button
            component={Link}
            href="/catalog/items/create"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Add Your First Item
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Active</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {item.name}
                    </Typography>
                    {item.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.available ? "Available" : "Unavailable"}
                      color={item.available ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.available}
                      onChange={() => handleToggleActive(item)}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleViewClick(item)}
                      color="info"
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(item)}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteDialog({ open: true, item })}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog - Preview how item looks in menu */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, item: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Menu Item Preview</DialogTitle>
        <DialogContent>
          {viewDialog.item && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                {viewDialog.item.category}
              </Typography>
              <Card sx={{ maxWidth: 345, mx: "auto" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={viewDialog.item.imageUrl}
                  alt={viewDialog.item.name}
                  sx={{ bgcolor: "grey.200" }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    fontWeight={600}
                  >
                    {viewDialog.item.name}
                  </Typography>
                  {viewDialog.item.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {viewDialog.item.description}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      ₹{viewDialog.item.price}
                    </Typography>
                    <Chip
                      label={
                        viewDialog.item.available ? "Available" : "Unavailable"
                      }
                      color={viewDialog.item.available ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  This is how customers will see this item in the menu
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, item: null })}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (viewDialog.item) {
                handleEditClick(viewDialog.item);
                setViewDialog({ open: false, item: null });
              }
            }}
            startIcon={<EditIcon />}
          >
            Edit Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, item: null })}
        maxWidth="lg"
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

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
      >
        <DialogTitle>Delete Menu Item</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.item?.name}"? This
            action cannot be undone.
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
      <PageFooter backHref="/catalog" backText="Back to Items" />
    </Box>
  );
}
