"use client";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const SPICINESS_LEVEL_VALUES = [
  "None",
  "Mild",
  "Medium",
  "Spicy",
  "Extra Spicy",
] as const;

const PRICING_MODEL_VALUES = [
  "SinglePrice",
  "Variants",
  "Customizable",
  "ComboPricing",
] as const;

const STATUS_VALUES = [
  "Available",
  "Out of Stock",
  "Temporarily Unavailable",
] as const;

export interface ItemFormData {
  name: string;
  categoryId: string;
  description: string;
  nonVeg: boolean;
  type: string;
  cuisine: string;
  spicinessLevel: string;
  pricingModel: string;
  basePrice: string;
  active: boolean;
  status: string;
  isRecommended: boolean;
  isPopular: boolean;
  displayOrder: string;
  dietaryTags: string[];
  variantGroups: VariantGroupFormData[];
  addonGroups: AddonGroupFormData[];
  components: MenuItemComponentFormData[];
  nutritionalInfo: NutritionalInfoFormData;
  availability: AvailabilityFormData;
  imageUrl: string;
}

export interface MenuItemComponentFormData {
  itemId: string;
  quantity: string;
  isOptional: boolean;
}

export interface VariantGroupFormData {
  name: string;
  isRequired: boolean;
  selectionType: "single" | "multiple";
  options: VariantOptionFormData[];
}

export interface VariantOptionFormData {
  name: string;
  price: string;
  calories: string;
}

export interface AddonGroupFormData {
  name: string;
  selectionType: "single" | "multiple";
  options: AddonOptionFormData[];
}

export interface AddonOptionFormData {
  name: string;
  price: string;
}

export interface NutritionalInfoFormData {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  sugar: string;
}

export interface AvailabilityFormData {
  days: string[];
  startTime: string;
  endTime: string;
}

interface ItemFormProps {
  formData: ItemFormData;
  onChange: (field: keyof ItemFormData, value: any) => void;
  categories?: { id: string; name: string }[];
}

export default function ItemForm({
  formData,
  onChange,
  categories = [],
}: ItemFormProps) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const loadingCategories = categories.length === 0;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          required
          label="Item Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g., Cheese Pizza"
          helperText="Enter a descriptive name for the menu item"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          required
          label="Price"
          type="number"
          value={formData.basePrice}
          onChange={(e) => onChange("basePrice", e.target.value)}
          placeholder="109.99"
          helperText="Enter the price"
          inputProps={{ min: 0, step: 0.01 }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => onChange("categoryId", e.target.value)}
            disabled={loadingCategories}
          >
            {loadingCategories ? (
              <MenuItem value="">Loading...</MenuItem>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))
            ) : (
              <>
                <MenuItem value="VEG">VEG</MenuItem>
                <MenuItem value="NON_VEG">NON_VEG</MenuItem>
              </>
            )}
          </Select>
        </FormControl>
      </Grid>
      {/* Veg/Non-Veg Toggle */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: formData.nonVeg ? "error.main" : "success.main",
                fontWeight: 600,
                minWidth: 60,
              }}
            >
              {formData.nonVeg ? "NON-VEG" : "VEG"}
            </Typography>
            <Switch
              checked={formData.nonVeg}
              onChange={(e) => onChange("nonVeg", e.target.checked)}
              color="success"
              inputProps={{ "aria-label": "Veg/Non-Veg toggle" }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Toggle to switch between Veg and Non-Veg
          </Typography>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }}>
        <TextField
          fullWidth
          label="Image URL"
          value={formData.imageUrl}
          onChange={(e) => onChange("imageUrl", e.target.value)}
          placeholder="https://example.com/images/cheese_pizza.jpg"
          helperText="Optional: URL of the item image"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="A delicious cheese pizza with a crispy crust and melted cheese."
          helperText="Provide additional details about ingredients or preparation"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 2 }}>
        <TextField
          fullWidth
          label="Display Order"
          type="number"
          value={formData.displayOrder}
          onChange={(e) => onChange("displayOrder", e.target.value)}
          placeholder="1"
          helperText="Order in which the item appears"
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Pricing Model</InputLabel>
          <Select
            label="Pricing Model"
            value={formData.pricingModel}
            onChange={(e) => onChange("pricingModel", e.target.value)}
          >
            {PRICING_MODEL_VALUES.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            {STATUS_VALUES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Availability Days</InputLabel>
          <Select
            multiple
            label="Availability Days"
            value={formData.availability.days}
            onChange={(e) =>
              onChange("availability", {
                ...formData.availability,
                days: e.target.value as string[],
              })
            }
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                <Checkbox
                  checked={formData.availability.days.indexOf(day) > -1}
                />
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Start Time"
          type="time"
          value={formData.availability.startTime}
          onChange={(e) =>
            onChange("availability", {
              ...formData.availability,
              startTime: e.target.value,
            })
          }
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="End Time"
          type="time"
          value={formData.availability.endTime}
          onChange={(e) =>
            onChange("availability", {
              ...formData.availability,
              endTime: e.target.value,
            })
          }
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Spicy Level</InputLabel>
          <Select
            label="Spicy Level"
            value={formData.spicinessLevel}
            onChange={(e) => onChange("spicinessLevel", e.target.value)}
          >
            {SPICINESS_LEVEL_VALUES.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Cuisine"
          value={formData.cuisine}
          onChange={(e) => onChange("cuisine", e.target.value)}
          placeholder="Italian"
          helperText="Type of cuisine"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => onChange("type", e.target.value)}
          >
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Combo">Combo</MenuItem>
            <MenuItem value="Special">Special</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isPopular}
              onChange={(e) => onChange("isPopular", e.target.checked)}
            />
          }
          label={<Typography variant="body2">Popular</Typography>}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isRecommended}
              onChange={(e) => onChange("isRecommended", e.target.checked)}
            />
          }
          label={<Typography variant="body2">Recommended</Typography>}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.active}
              onChange={(e) => onChange("active", e.target.checked)}
            />
          }
          label={<Typography variant="body2">Active</Typography>}
        />
      </Grid>
    </Grid>
  );
}
