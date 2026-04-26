"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

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
  organisationId: string;
  description: string;
  imageUrls: { url: string; type: "primary" | "thumbnail" | "gallery" }[];
  cuisine: string;
  type: string;
  spicinessLevel: string;
  preparationTime: string;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  dietaryTags: string[];
  pricingModel: string;
  basePrice: string;
  currency: string;
  variantGroups: VariantGroupFormData[];
  addonGroups: AddonGroupFormData[];
  components: MenuItemComponentFormData[];
  nutritionalInfo: NutritionalInfoFormData;
  availability: AvailabilityFormData;
  status: string;
  active: boolean;
  isRecommended: boolean;
  isPopular: boolean;
  displayOrder: string;
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

  const imageUrls =
    formData.imageUrls && formData.imageUrls.length
      ? formData.imageUrls
      : [{ url: "", type: "primary" }];
  const allergens = formData.allergens ?? [];
  const dietaryTags = formData.dietaryTags ?? [];
  const variantGroups = formData.variantGroups ?? [];
  const addonGroups = formData.addonGroups ?? [];
  const components = formData.components ?? [];
  const loadingCategories = categories.length === 0;

  const addImageUrl = () =>
    onChange("imageUrls", [...imageUrls, { url: "", type: "primary" }]);
  const removeImageUrl = (index: number) =>
    onChange(
      "imageUrls",
      imageUrls.filter((_, i) => i !== index),
    );
  const updateImageUrl = (
    index: number,
    field: "url" | "type",
    value: string,
  ) => {
    onChange(
      "imageUrls",
      imageUrls.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addAllergen = () => onChange("allergens", [...allergens, ""]);
  const removeAllergen = (index: number) =>
    onChange(
      "allergens",
      allergens.filter((_, i) => i !== index),
    );
  const updateAllergen = (index: number, value: string) =>
    onChange(
      "allergens",
      allergens.map((item, i) => (i === index ? value : item)),
    );

  const addDietaryTag = () => onChange("dietaryTags", [...dietaryTags, ""]);
  const removeDietaryTag = (index: number) =>
    onChange(
      "dietaryTags",
      dietaryTags.filter((_, i) => i !== index),
    );
  const updateDietaryTag = (index: number, value: string) =>
    onChange(
      "dietaryTags",
      dietaryTags.map((item, i) => (i === index ? value : item)),
    );

  const addVariantGroup = () =>
    onChange("variantGroups", [
      ...variantGroups,
      { name: "", isRequired: false, selectionType: "single", options: [] },
    ]);
  const removeVariantGroup = (index: number) =>
    onChange(
      "variantGroups",
      variantGroups.filter((_, i) => i !== index),
    );
  const addVariantOption = (groupIndex: number) =>
    onChange(
      "variantGroups",
      variantGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              options: [
                ...group.options,
                { name: "", price: "", calories: "" },
              ],
            }
          : group,
      ),
    );
  const updateVariantOption = (
    groupIndex: number,
    optionIndex: number,
    field: keyof VariantOptionFormData,
    value: string,
  ) =>
    onChange(
      "variantGroups",
      variantGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              options: group.options.map((option, idx) =>
                idx === optionIndex ? { ...option, [field]: value } : option,
              ),
            }
          : group,
      ),
    );
  const removeVariantOption = (groupIndex: number, optionIndex: number) =>
    onChange(
      "variantGroups",
      variantGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              options: group.options.filter((_, idx) => idx !== optionIndex),
            }
          : group,
      ),
    );

  const addAddonGroup = () =>
    onChange("addonGroups", [
      ...addonGroups,
      { name: "", selectionType: "multiple", options: [] },
    ]);
  const removeAddonGroup = (index: number) =>
    onChange(
      "addonGroups",
      addonGroups.filter((_, i) => i !== index),
    );
  const addAddonOption = (groupIndex: number) =>
    onChange(
      "addonGroups",
      addonGroups.map((group, i) =>
        i === groupIndex
          ? { ...group, options: [...group.options, { name: "", price: "" }] }
          : group,
      ),
    );
  const updateAddonOption = (
    groupIndex: number,
    optionIndex: number,
    field: keyof AddonOptionFormData,
    value: string,
  ) =>
    onChange(
      "addonGroups",
      addonGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              options: group.options.map((option, idx) =>
                idx === optionIndex ? { ...option, [field]: value } : option,
              ),
            }
          : group,
      ),
    );
  const removeAddonOption = (groupIndex: number, optionIndex: number) =>
    onChange(
      "addonGroups",
      addonGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              options: group.options.filter((_, idx) => idx !== optionIndex),
            }
          : group,
      ),
    );

  const addComponent = () =>
    onChange("components", [
      ...components,
      { itemId: "", quantity: "1", isOptional: false },
    ]);
  const removeComponent = (index: number) =>
    onChange(
      "components",
      components.filter((_, i) => i !== index),
    );
  const updateComponent = (
    index: number,
    field: keyof MenuItemComponentFormData,
    value: string | boolean,
  ) =>
    onChange(
      "components",
      components.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );

  return (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary>Basic Information</AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Item Name *"
                value={formData.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="e.g., Cheese Pizza"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => onChange("categoryId", e.target.value)}
                  label="Category"
                  disabled={loadingCategories}
                >
                  {loadingCategories ? (
                    <MenuItem disabled value="">
                      Loading categories...
                    </MenuItem>
                  ) : (
                    categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Cuisine"
                value={formData.cuisine}
                onChange={(e) => onChange("cuisine", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => onChange("type", e.target.value)}
                  label="Type"
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Combo">Combo</MenuItem>
                  <MenuItem value="Special">Special</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Preparation Time (minutes)"
                value={formData.preparationTime}
                onChange={(e) => onChange("preparationTime", e.target.value)}
                inputProps={{ min: "1", max: "120" }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Spiciness Level</InputLabel>
                <Select
                  value={formData.spicinessLevel}
                  onChange={(e) => onChange("spicinessLevel", e.target.value)}
                  label="Spiciness Level"
                >
                  {SPICINESS_LEVEL_VALUES.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>Dietary & Allergens</AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVegetarian}
                    onChange={(e) => onChange("isVegetarian", e.target.checked)}
                  />
                }
                label="Vegetarian"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVegan}
                    onChange={(e) => onChange("isVegan", e.target.checked)}
                  />
                }
                label="Vegan"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isGlutenFree}
                    onChange={(e) => onChange("isGlutenFree", e.target.checked)}
                  />
                }
                label="Gluten Free"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom>
                Allergens
              </Typography>
              {allergens.map((allergen, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={allergen}
                    onChange={(e) => {
                      updateAllergen(index, e.target.value);
                    }}
                  />
                  <IconButton onClick={() => removeAllergen(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addAllergen}
                size="small"
              >
                Add Allergen
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom>
                Dietary Tags
              </Typography>
              {dietaryTags.map((tag, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={tag}
                    onChange={(e) => {
                      updateDietaryTag(index, e.target.value);
                    }}
                  />
                  <IconButton onClick={() => removeDietaryTag(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addDietaryTag}
                size="small"
              >
                Add Dietary Tag
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary>Pricing</AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Base Price *"
                value={formData.basePrice}
                onChange={(e) => onChange("basePrice", e.target.value)}
                inputProps={{ step: "0.01", min: "0.01" }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency || "INR"}
                  onChange={(e) => onChange("currency", e.target.value)}
                  label="Currency"
                >
                  <MenuItem value="INR">INR (₹)</MenuItem>
                  <MenuItem value="USD">USD ($)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Pricing Model</InputLabel>
                <Select
                  value={
                    PRICING_MODEL_VALUES.includes(
                      formData.pricingModel as (typeof PRICING_MODEL_VALUES)[number],
                    )
                      ? formData.pricingModel
                      : ""
                  }
                  onChange={(e) => onChange("pricingModel", e.target.value)}
                  label="Pricing Model"
                >
                  {PRICING_MODEL_VALUES.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model.replace(/([A-Z])/g, " $1").trim()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Display Order"
                value={formData.displayOrder}
                onChange={(e) => onChange("displayOrder", e.target.value)}
                inputProps={{ min: "0" }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>Status & Visibility</AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => onChange("status", e.target.value)}
                  label="Status"
                >
                  {STATUS_VALUES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
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
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isRecommended}
                    onChange={(e) =>
                      onChange("isRecommended", e.target.checked)
                    }
                  />
                }
                label="Recommended"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isPopular}
                    onChange={(e) => onChange("isPopular", e.target.checked)}
                  />
                }
                label="Popular"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>Availability</AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Days</InputLabel>
                <Select
                  multiple
                  value={formData.availability.days}
                  onChange={(e) =>
                    onChange("availability", {
                      ...formData.availability,
                      days: e.target.value as string[],
                    })
                  }
                  renderValue={(selected) => (selected as string[]).join(", ")}
                  label="Days"
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                      <Checkbox
                        checked={formData.availability.days.includes(day)}
                      />
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
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
            <Grid size={{ xs: 12, sm: 3 }}>
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
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>Images</AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" gutterBottom>
            Image URLs
          </Typography>
          {imageUrls.map((img, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid size={7}>
                <TextField
                  fullWidth
                  label={`Image URL ${index + 1}`}
                  value={img.url}
                  onChange={(e) => updateImageUrl(index, "url", e.target.value)}
                />
              </Grid>
              <Grid size={3}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={img.type}
                    onChange={(e) =>
                      updateImageUrl(index, "type", e.target.value)
                    }
                    label="Type"
                  >
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="thumbnail">Thumbnail</MenuItem>
                    <MenuItem value="gallery">Gallery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={2}>
                <IconButton
                  onClick={() => removeImageUrl(index)}
                  color="error"
                  size="large"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={addImageUrl}>
            Add Image
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>Variant Groups</AccordionSummary>
        <AccordionDetails>
          {variantGroups.map((group, gIndex) => (
            <Box
              key={gIndex}
              sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: 1 }}
            >
              <Grid container spacing={2}>
                <Grid size={4}>
                  <TextField
                    fullWidth
                    label="Group Name"
                    value={group.name}
                    onChange={(e) =>
                      onChange(
                        "variantGroups",
                        variantGroups.map((item, idx) =>
                          idx === gIndex
                            ? { ...item, name: e.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                </Grid>
                <Grid size={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={group.isRequired}
                        onChange={(e) => {
                          onChange(
                            "variantGroups",
                            variantGroups.map((item, idx) =>
                              idx === gIndex
                                ? { ...item, isRequired: e.target.checked }
                                : item,
                            ),
                          );
                        }}
                      />
                    }
                    label="Required"
                  />
                </Grid>
                <Grid size={3}>
                  <FormControl fullWidth>
                    <InputLabel>Selection Type</InputLabel>
                    <Select
                      value={group.selectionType}
                      onChange={(e) =>
                        onChange(
                          "variantGroups",
                          variantGroups.map((item, idx) =>
                            idx === gIndex
                              ? {
                                  ...item,
                                  selectionType: e.target.value as
                                    | "single"
                                    | "multiple",
                                }
                              : item,
                          ),
                        )
                      }
                      label="Selection Type"
                    >
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="multiple">Multiple</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={3}>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => removeVariantGroup(gIndex)}
                    color="error"
                  >
                    Remove Group
                  </Button>
                </Grid>
              </Grid>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Options
              </Typography>
              {group.options.map((opt, oIndex) => (
                <Grid container spacing={2} key={oIndex} sx={{ mb: 1 }}>
                  <Grid size={4}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Option Name"
                      value={opt.name}
                      onChange={(e) =>
                        updateVariantOption(
                          gIndex,
                          oIndex,
                          "name",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>
                  <Grid size={3}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Price"
                      type="number"
                      value={opt.price}
                      onChange={(e) =>
                        updateVariantOption(
                          gIndex,
                          oIndex,
                          "price",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: "0.01" }}
                    />
                  </Grid>
                  <Grid size={3}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Calories"
                      type="number"
                      value={opt.calories}
                      onChange={(e) =>
                        updateVariantOption(
                          gIndex,
                          oIndex,
                          "calories",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>
                  <Grid size={2}>
                    <IconButton
                      onClick={() => removeVariantOption(gIndex, oIndex)}
                      color="error"
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addVariantOption(gIndex)}
                size="small"
              >
                Add Option
              </Button>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={addVariantGroup}>
            Add Variant Group
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>Addon Groups</AccordionSummary>
        <AccordionDetails>
          {addonGroups.map((group, gIndex) => (
            <Box
              key={gIndex}
              sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: 1 }}
            >
              <Grid container spacing={2}>
                <Grid size={4}>
                  <TextField
                    fullWidth
                    label="Group Name"
                    value={group.name}
                    onChange={(e) =>
                      onChange(
                        "addonGroups",
                        addonGroups.map((item, idx) =>
                          idx === gIndex
                            ? { ...item, name: e.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                </Grid>
                <Grid size={3}>
                  <FormControl fullWidth>
                    <InputLabel>Selection Type</InputLabel>
                    <Select
                      value={group.selectionType}
                      onChange={(e) =>
                        onChange(
                          "addonGroups",
                          addonGroups.map((item, idx) =>
                            idx === gIndex
                              ? {
                                  ...item,
                                  selectionType: e.target.value as
                                    | "single"
                                    | "multiple",
                                }
                              : item,
                          ),
                        )
                      }
                      label="Selection Type"
                    >
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="multiple">Multiple</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={3}>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => removeAddonGroup(gIndex)}
                    color="error"
                  >
                    Remove Group
                  </Button>
                </Grid>
              </Grid>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Addon Options
              </Typography>
              {group.options.map((opt, oIndex) => (
                <Grid container spacing={2} key={oIndex} sx={{ mb: 1 }}>
                  <Grid size={5}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Option Name"
                      value={opt.name}
                      onChange={(e) =>
                        updateAddonOption(
                          gIndex,
                          oIndex,
                          "name",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>
                  <Grid size={5}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Price"
                      type="number"
                      value={opt.price}
                      onChange={(e) =>
                        updateAddonOption(
                          gIndex,
                          oIndex,
                          "price",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: "0.01" }}
                    />
                  </Grid>
                  <Grid size={2}>
                    <IconButton
                      onClick={() => removeAddonOption(gIndex, oIndex)}
                      color="error"
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addAddonOption(gIndex)}
                size="small"
              >
                Add Option
              </Button>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={addAddonGroup}>
            Add Addon Group
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>Components</AccordionSummary>
        <AccordionDetails>
          {components.map((component, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ mb: 2, alignItems: "center" }}
            >
              <Grid size={5}>
                <TextField
                  fullWidth
                  label="Component Item ID"
                  value={component.itemId}
                  onChange={(e) =>
                    updateComponent(index, "itemId", e.target.value)
                  }
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={component.quantity}
                  onChange={(e) =>
                    updateComponent(index, "quantity", e.target.value)
                  }
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={component.isOptional}
                      onChange={(e) =>
                        updateComponent(index, "isOptional", e.target.checked)
                      }
                    />
                  }
                  label="Optional"
                />
              </Grid>
              <Grid size={1}>
                <IconButton
                  onClick={() => removeComponent(index)}
                  color="error"
                  size="large"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={addComponent}>
            Add Component
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>Nutritional Information</AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Calories"
                type="number"
                value={formData.nutritionalInfo.calories}
                onChange={(e) => {
                  const newInfo = { ...formData.nutritionalInfo };
                  newInfo.calories = e.target.value;
                  onChange("nutritionalInfo", newInfo);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Protein (g)"
                type="number"
                value={formData.nutritionalInfo.protein}
                onChange={(e) => {
                  const newInfo = { ...formData.nutritionalInfo };
                  newInfo.protein = e.target.value;
                  onChange("nutritionalInfo", newInfo);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Carbs (g)"
                type="number"
                value={formData.nutritionalInfo.carbs}
                onChange={(e) => {
                  const newInfo = { ...formData.nutritionalInfo };
                  newInfo.carbs = e.target.value;
                  onChange("nutritionalInfo", newInfo);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Fat (g)"
                type="number"
                value={formData.nutritionalInfo.fat}
                onChange={(e) => {
                  const newInfo = { ...formData.nutritionalInfo };
                  newInfo.fat = e.target.value;
                  onChange("nutritionalInfo", newInfo);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                fullWidth
                label="Sugar (g)"
                type="number"
                value={formData.nutritionalInfo.sugar}
                onChange={(e) => {
                  const newInfo = { ...formData.nutritionalInfo };
                  newInfo.sugar = e.target.value;
                  onChange("nutritionalInfo", newInfo);
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
