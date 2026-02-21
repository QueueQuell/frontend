"use client";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export interface CategoryFormData {
  name: string;
  description: string;
  displayOrder: string;
  isActive: boolean;
  color: string;
}

interface CategoryFormProps {
  formData: CategoryFormData;
  onChange: (field: keyof CategoryFormData, value: any) => void;
}

export default function CategoryForm({
  formData,
  onChange,
}: CategoryFormProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          label="Category Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g., Appetizers, Main Courses, Desserts"
          helperText="Enter a descriptive name for the category"
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
          placeholder="Optional description for the category"
          helperText="Provide additional context about this category"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          type="number"
          label="Display Order"
          value={formData.displayOrder}
          onChange={(e) => onChange("displayOrder", e.target.value)}
          placeholder="1"
          helperText="Order in which categories appear (lower numbers first)"
          inputProps={{ min: 1 }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.isActive ? "true" : "false"}
            label="Status"
            onChange={(e) => onChange("isActive", e.target.value === "true")}
          >
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          type="color"
          label="Category Color"
          value={formData.color}
          onChange={(e) => onChange("color", e.target.value)}
          helperText="Choose a color to represent this Category"
        />
      </Grid>
    </Grid>
  );
}
