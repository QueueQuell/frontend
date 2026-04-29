"use client";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export interface SectionFormData {
  name: string;
  description: string;
  displayOrder: string;
  isActive: boolean;
  color: string;
}

interface SectionFormProps {
  formData: SectionFormData;
  onChange: (field: keyof SectionFormData, value: any) => void;
}

export default function SectionForm({ formData, onChange }: SectionFormProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          label="Section Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g., Appetizers, Main Courses, Desserts"
          helperText="Enter a descriptive name for the section"
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
          placeholder="Optional description for the section"
          helperText="Provide additional context about this section"
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
          helperText="Order in which sections appear (lower numbers first)"
          slotProps={{ htmlInput: { min: 1 } }}
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
          label="Section Color"
          value={formData.color}
          onChange={(e) => onChange("color", e.target.value)}
          helperText="Choose a color to represent this Section"
        />
      </Grid>
    </Grid>
  );
}
