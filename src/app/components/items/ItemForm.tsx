"use client";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export interface ItemFormData {
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  description: string;
  availability: string;
  preparationTime: string;
}

interface ItemFormProps {
  formData: ItemFormData;
  onChange: (field: keyof ItemFormData, value: any) => void;
}

export default function ItemForm({ formData, onChange }: ItemFormProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          required
          label="Item Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g., Margherita Pizza"
          helperText="Enter a descriptive name for the menu item"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => onChange("category", e.target.value)}
          >
            <MenuItem value="pizza">Pizza</MenuItem>
            <MenuItem value="salads">Salads</MenuItem>
            <MenuItem value="main">Main Course</MenuItem>
            <MenuItem value="desserts">Desserts</MenuItem>
            <MenuItem value="beverages">Beverages</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          required
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => onChange("price", e.target.value)}
          placeholder="0.00"
          helperText="Enter the price in rupees"
          inputProps={{ min: 0, step: 0.01 }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Image URL"
          value={formData.imageUrl}
          onChange={(e) => onChange("imageUrl", e.target.value)}
          placeholder="https://example.com/image.jpg"
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
          placeholder="Optional description of the menu item"
          helperText="Provide additional details about ingredients or preparation"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Availability</InputLabel>
          <Select
            label="Availability"
            value={formData.availability}
            onChange={(e) => onChange("availability", e.target.value)}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Preparation Time (minutes)"
          type="number"
          value={formData.preparationTime}
          onChange={(e) => onChange("preparationTime", e.target.value)}
          placeholder="15"
          helperText="Optional: Time needed to prepare this item"
          inputProps={{ min: 1 }}
        />
      </Grid>
    </Grid>
  );
}

