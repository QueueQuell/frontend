"use client";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export interface ItemFormData {
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  description: string;
  displayOrder: string;
  tags: string;
  availabilityDays: string[];
  availabilityTimeSlots: string;
  spicyLevel: string;
  featured: boolean;
  recommended: boolean;
  specialInstructions: string;
  preparationTime: string;
  cuisine: string;
  extraOptions: { name: string; price: string }[];
  sectionId: string;
  active: boolean;
  additionalInfo: string;
}

interface ItemFormProps {
  formData: ItemFormData;
  onChange: (field: keyof ItemFormData, value: any) => void;
}

export default function ItemForm({ formData, onChange }: ItemFormProps) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => onChange("category", e.target.value)}
          >
            <MenuItem value="VEG">VEG</MenuItem>
            <MenuItem value="NON_VEG">NON_VEG</MenuItem>
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
          placeholder="109.99"
          helperText="Enter the price"
          inputProps={{ min: 0, step: 0.01 }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
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
      <Grid size={{ xs: 12, sm: 6 }}>
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Tags"
          value={formData.tags}
          onChange={(e) => onChange("tags", e.target.value)}
          placeholder="popular, vegetarian"
          helperText="Comma-separated tags"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <InputLabel>Availability Days</InputLabel>
          <Select
            multiple
            label="Availability Days"
            value={formData.availabilityDays}
            onChange={(e) => onChange("availabilityDays", e.target.value)}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                <Checkbox checked={formData.availabilityDays.indexOf(day) > -1} />
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Availability Time Slots"
          value={formData.availabilityTimeSlots}
          onChange={(e) => onChange("availabilityTimeSlots", e.target.value)}
          placeholder='[{"start": "11:00", "end": "22:00"}]'
          helperText="JSON array of time slots"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Spicy Level</InputLabel>
          <Select
            label="Spicy Level"
            value={formData.spicyLevel}
            onChange={(e) => onChange("spicyLevel", e.target.value)}
          >
            <MenuItem value="MILD">MILD</MenuItem>
            <MenuItem value="MEDIUM">MEDIUM</MenuItem>
            <MenuItem value="HOT">HOT</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.featured}
              onChange={(e) => onChange("featured", e.target.checked)}
            />
          }
          label="Featured"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.recommended}
              onChange={(e) => onChange("recommended", e.target.checked)}
            />
          }
          label="Recommended"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Special Instructions"
          value={formData.specialInstructions}
          onChange={(e) => onChange("specialInstructions", e.target.value)}
          placeholder="Cut into 8 slices"
          helperText="Special preparation instructions"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Preparation Time (minutes)"
          type="number"
          value={formData.preparationTime}
          onChange={(e) => onChange("preparationTime", e.target.value)}
          placeholder="15"
          helperText="Time needed to prepare this item"
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Cuisine"
          value={formData.cuisine}
          onChange={(e) => onChange("cuisine", e.target.value)}
          placeholder="Italian"
          helperText="Type of cuisine"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div>
          <label>Extra Options</label>
          {formData.extraOptions.map((option, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
              <Grid size={{ xs: 5 }}>
                <TextField
                  fullWidth
                  label="Option Name"
                  value={option.name}
                  onChange={(e) => {
                    const newOptions = [...formData.extraOptions];
                    newOptions[index].name = e.target.value;
                    onChange("extraOptions", newOptions);
                  }}
                  placeholder="e.g., Extra Cheese"
                />
              </Grid>
              <Grid size={{ xs: 5 }}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={option.price}
                  onChange={(e) => {
                    const newOptions = [...formData.extraOptions];
                    newOptions[index].price = e.target.value;
                    onChange("extraOptions", newOptions);
                  }}
                  placeholder="0.00"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid size={{ xs: 2 }}>
                <IconButton
                  onClick={() => {
                    const newOptions = formData.extraOptions.filter((_, i) => i !== index);
                    onChange("extraOptions", newOptions);
                  }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              const newOptions = [...formData.extraOptions, { name: "", price: "" }];
              onChange("extraOptions", newOptions);
            }}
            sx={{ mt: 2 }}
          >
            Add Option
          </Button>
        </div>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Section ID"
          value={formData.sectionId}
          onChange={(e) => onChange("sectionId", e.target.value)}
          placeholder="SA000001"
          helperText="ID of the section this item belongs to"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.active}
              onChange={(e) => onChange("active", e.target.checked)}
            />
          }
          label="Active"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Additional Info"
          value={formData.additionalInfo}
          onChange={(e) => onChange("additionalInfo", e.target.value)}
          placeholder='{"ingredients": ["Flour", "Cheese"], "allergens": ["Gluten", "Dairy"], "nutrition": {"calories": 300}}'
          helperText="JSON object with ingredients, allergens, nutrition"
        />
      </Grid>
    </Grid>
  );
}

