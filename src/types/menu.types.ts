/**
 * Types matching backend Menu DTOs exactly
 * Reference: src/modules/menu/types/menu.types.ts (backend)
 */

export type SpicinessLevel =
  | "None"
  | "Mild"
  | "Medium"
  | "Spicy"
  | "Extra Spicy";
export type PricingModel =
  | "SinglePrice"
  | "Variants"
  | "Customizable"
  | "ComboPricing";
export type ImageType = "primary" | "thumbnail" | "gallery";
export type SelectionType = "single" | "multiple";
export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export type STATUS_VALUES =
  | "Available"
  | "Out of Stock"
  | "Temporarily Unavailable";

export interface ImageDto {
  url: string;
  type?: ImageType;
}

export interface VariantOptionDto {
  name: string;
  price?: number;
  calories?: number;
}

export interface VariantGroupDto {
  name: string;
  isRequired?: boolean;
  selectionType?: SelectionType;
  options: VariantOptionDto[];
}

export interface AddonOptionDto {
  name: string;
  price?: number;
}

export interface AddonGroupDto {
  name: string;
  selectionType?: SelectionType;
  options: AddonOptionDto[];
}

export interface ComponentDto {
  itemId: string;
  quantity?: number;
  isOptional?: boolean;
}

export interface NutritionalInfoDTO {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface AvailabilityDto {
  days?: Day[];
  startTime?: string;
  endTime?: string;
}

export interface CreateMenuItemDTO {
  // Mandatory
  name: string;
  basePrice: number;
  categoryId: string;

  // Optional
  description?: string;
  images?: ImageDto[];
  image?: string; // legacy
  isAvailable?: boolean;
  preparationTime?: number;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  cuisine?: string;
  spicinessLevel?: SpicinessLevel;
  dietaryTags?: string[];
  pricingModel?: PricingModel;
  currency?: string;
  displayOrder?: number;
  isRecommended?: boolean;
  isPopular?: boolean;

  // Nested
  variantGroups?: VariantGroupDto[];
  addonGroups?: AddonGroupDto[];
  components?: ComponentDto[];
  nutritionalInfo?: NutritionalInfoDTO;
  availability?: AvailabilityDto;
}

// Fixed: UpdateMenuItemDTO - all fields optional (single declaration)
export type UpdateMenuItemDTO = Partial<CreateMenuItemDTO>;
