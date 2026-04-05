export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Authentication Types
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthDetails {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface User {
  id: string;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  organisationId: string;
  isActive: boolean;
  createdAt: string;
  address: UserAddress;
  org: UserOrg;
  config: UserConfig;
}

export interface UserConfig {
  theme: string;
  language: string;
  timezone?: string;
  currency?: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dateFormat?: string;
  showTutorial?: boolean;
}

export interface UserAddress {
  addressLine1: string;
  addressLine2?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isVerified: boolean;
}

export interface UserOrg {
  id: string;
  name: string;
}

export interface LoginResponse {
  authDetails: AuthDetails;
  user: User;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface UserCreate {
  email: string;
  password: string;
  title: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  role: string;
  address: UserAddress;
}

export interface UserListParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  role?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface UserListResponse extends ApiResponse<User[]> {
  pagination: Pagination;
}

export interface UserUpdate {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  status?: string | null;
}

export interface OrgCreate {
  display_name: string;
  plan?: string;
  timezone?: string;
}

export interface OrgOut {
  id: string;
  display_name: string;
  plan: string;
  timezone: string;
}

// Organisation Types based on API response
export interface OrganisationAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode?: string;
  country: string;
}

export interface OrganisationPaymentDetails {
  upiQR?: string;
  upiId?: string;
  merchantId?: string;
  merchantName?: string;
  enabledMethods?: string[];
  gatewayKeys?: {
    razorpayKey?: string;
    stripeKey?: string;
  };
}

export interface OrganisationUIDesign {
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  theme?: string;
  menuLayout?: string;
}

export interface OrganisationBusiness {
  isPremium?: boolean;
  taxPercentage?: number;
  taxLabel?: string;
  currency?: string;
  currencySymbol?: string;
  packagingCharge?: number;
  deliveryCharge?: number;
  freeDeliveryAbove?: number;
  minOrderAmount?: number;
}

export interface OrganisationFeatures {
  videoMenuEnabled?: boolean;
  multiLanguageEnabled?: boolean;
  supportedLanguages?: string[];
  ratingEnabled?: boolean;
  reviewsEnabled?: boolean;
  loyaltyEnabled?: boolean;
  tableOrderingEnabled?: boolean;
  takeawayEnabled?: boolean;
  deliveryEnabled?: boolean;
}

export interface OrganisationTiming {
  timezone?: string;
  openTime?: string;
  closeTime?: string;
  weeklyOff?: string[];
  holidays?: string[];
}

export interface OrganisationNotifications {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  whatsappEnabled?: boolean;
  notificationEmail?: string;
  notificationPhone?: string;
}

export interface OrganisationQRConfig {
  customBaseUrl?: string;
  useCustomUrl?: boolean;
}

export interface OrganisationConfigurations {
  uiDesign?: OrganisationUIDesign;
  business?: OrganisationBusiness;
  features?: OrganisationFeatures;
  timing?: OrganisationTiming;
  notifications?: OrganisationNotifications;
  qrConfig?: OrganisationQRConfig;
}

export interface Organisation {
  id: string;
  parentOrgId: string | null;
  organisationName: string;
  displayName: string;
  tagLine?: string;
  logo?: string;
  customDomain?: string;
  type: "company" | "branch";
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;
  secondaryEmail?: string;
  address: OrganisationAddress;
  paymentDetails?: OrganisationPaymentDetails;
  configurations?: OrganisationConfigurations;
  status: "active" | "inactive";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganisationListResponse extends ApiResponse<Organisation[]> {
  pagination: Pagination;
}

export interface StoreCreate {
  name: string;
  address?: string | null;
  hours?: string | null;
}

export interface StoreOut {
  id: string;
  name: string;
  address?: string | null;
  hours?: string | null;
}

export interface ItemCreate {
  sku: string;
  name: string;
  description?: string | null;
  unit?: string;
  pack_size?: number;
  reorder_point?: number;
  vendor_id?: string | null;
}

export interface ItemOut {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  unit: string;
  pack_size: number;
  reorder_point: number;
  vendor_id?: string | null;
}

export interface ItemUpdate {
  name?: string | null;
  description?: string | null;
  unit?: string | null;
  pack_size?: number | null;
  reorder_point?: number | null;
  vendor_id?: string | null;
}

export interface WarehouseCreate {
  name: string;
  location?: string | null;
}

export interface WarehouseOut {
  id: string;
  name: string;
  location?: string | null;
}

export interface VendorCreate {
  name: string;
  contact?: string | null;
}

export interface VendorOut {
  id: string;
  name: string;
  contact?: string | null;
}

export interface StockAdjustment {
  warehouse_id: string;
  delta: number;
  reason?: string;
}

export interface StockLevel {
  item_id: string;
  warehouse_id: string;
  quantity: number;
  updated_at?: string | null;
}

export interface BatchCreate {
  code: string;
  expiry_ts?: string | null;
  quantity: number;
}

export interface BatchOut {
  code: string;
  expiry_ts?: string | null;
  quantity: number;
  id: string;
  item_id: string;
}

export interface PublishMenu {
  env?: string;
  note?: string | null;
}

export interface SetAvailability {
  is_available: boolean;
}

export interface QRGenerate {
  scope: string;
  ttl?: number;
}

export interface CheckoutRequest {
  cart_id: string;
  payment_intent?: string | null;
}

export interface SplitBill {
  splits?: number[];
  tips?: number;
}

export interface PromiseTime {
  minutes: number;
}

export interface StageUpdate {
  stage: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// ============================================================================
// Generic Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data?: T;
  pagination?: Pagination;
  error?: string;
  message?: string;
  success: boolean;
  errors?: { field: string; message: string }[];
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  detail?: string | ValidationError[];
  message?: string;
  error?: string;
  statusCode?: number;
}

// ============================================================================
// User & Organization Types
// ============================================================================

export interface UserOut {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrgMember {
  user_id: string;
  org_id: string;
  role: string;
  joined_at?: string;
}

// ============================================================================
// Menu & Pricing Types
// ============================================================================

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  section?: string;
  is_available: boolean;
  image_url?: string;
}

export interface PricingBook {
  id: string;
  name: string;
  description?: string;
  items: PricingBookItem[];
  created_at?: string;
  updated_at?: string;
}

export interface PricingBookItem {
  item_id: string;
  price: number;
  tax_profile_id?: string;
}

export interface TaxProfile {
  id: string;
  name: string;
  rate: number;
  hsn_code?: string;
  description?: string;
}

export interface Surcharge {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  description?: string;
}

// ============================================================================
// Order & Cart Types
// ============================================================================

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  created_at?: string;
}

export interface CartItem {
  item_id: string;
  quantity: number;
  price: number;
  name?: string;
}

export interface Order {
  id: string;
  cart_id: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface OrderTimeline {
  order_id: string;
  events: OrderEvent[];
}

export interface OrderEvent {
  stage: string;
  timestamp: string;
  note?: string;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface PaginationParams {
  page?: number;
  size?: number;
  limit?: number;
  offset?: number;
}

export interface SearchParams extends PaginationParams {
  q?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract keys of T that are of type U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Make specific properties of T required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties of T optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// ============================================================================
// Inventory Types (from old types)
// ============================================================================

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  section: string;
  quantity: number;
  unit: string;
  unitCost: number;
  location: string;
  lastUpdated: string;
  minStock?: number;
  maxStock?: number;
}

export interface CreateInventoryRequest {
  name: string;
  sku: string;
  section: string;
  quantity: number;
  unit: string;
  unitCost: number;
  location: string;
  minStock?: number;
  maxStock?: number;
}

export interface StockAdjustmentRequest {
  itemId: string;
  adjustmentType: "increase" | "decrease";
  quantity: number;
  reason: string;
  notes?: string;
}

// ============================================================================
// Customer Types (from old types)
// ============================================================================

export interface Customer {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address?: string;
  status: "Active" | "Inactive";
  orders: number;
  loyaltyPoints?: number;
  notes?: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  members: number;
  points: number;
  benefits: string;
}

// ============================================================================
// Menu Item Types (matching API structure)
// ============================================================================

export interface VariantOption {
  name: string;
  price: number;
  calories?: number;
}

export interface VariantGroup {
  name: string;
  isRequired: boolean;
  selectionType: "single" | "multiple";
  options: VariantOption[];
}

export interface AddonOption {
  name: string;
  price: number;
}

export interface AddonGroup {
  name: string;
  selectionType: "single" | "multiple";
  options: AddonOption[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
}

export interface Availability {
  days: string[];
  startTime: string;
  endTime: string;
}

export interface MenuItemComponent {
  itemId: string;
  quantity: number;
  isOptional: boolean;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: string;
  nonVeg: boolean;
  type?: string;
  cuisine?: string;
  spicinessLevel?: string;
  pricingModel?: string;
  basePrice: number;
  active?: boolean;
  status?: string;
  isRecommended?: boolean;
  isPopular?: boolean;
  displayOrder?: number;
  dietaryTags?: string[];
  variantGroups?: VariantGroup[];
  addonGroups?: AddonGroup[];
  components?: MenuItemComponent[];
  nutritionalInfo?: NutritionalInfo;
  availability?: Availability;
}

// ============================================================================
// Supplier Types (from old types)
// ============================================================================

export interface CreateSupplierRequest {
  name: string;
  section: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
}

// ============================================================================
// Payment Types (from old types)
// ============================================================================

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: "Completed" | "Pending" | "Failed";
  date: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  method: string;
}

// ============================================================================
// QR Types (from old types)
// ============================================================================

export interface QRCode {
  id: string;
  type: "table" | "menu" | "custom";
  identifier: string;
  url: string;
  qrCodeData: string;
  description?: string;
  status: "Active" | "Inactive";
}

export interface GenerateQRRequest {
  type: "table" | "menu" | "custom";
  identifier: string;
  customUrl?: string;
  description?: string;
}

// Admin QR Generate API Types
export interface AdminQRGenerateRequest {
  tableNumber?: string;
  orderType?: "dine-in" | "takeout" | "delivery";
  baseUrl?: string;
}

export interface AdminQRGenerateResponse {
  qrId: string;
  qrString: string;
  qrImageUrl: string;
  organisationId: string;
  tableNumber: string | null;
  orderType: string | null;
}

// Admin QR List Response Type
export interface AdminQRListItem {
  _id: string;
  qrString: string;
  qrUrl: string;
  baseUrl: string;
  organisationId: string;
  tableNumber: string | null;
  orderType: string | null;
  qrImageUrl: string;
  isActive: boolean;
  scannedCount: number;
  lastScannedAt: string | null;
  metadata: {
    generatedBy: string;
    notes: string | null;
    location: string | null;
  };
  generatedFrom: string | null;
  version: number;
  urlHistory: string[];
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Note: The apiClient wraps the response, so we use AdminQRListItem[] directly
// The actual response from the API is: { success: true, data: AdminQRListItem[] }
// After apiClient processing, response.data is AdminQRListItem[]
export type AdminQRListResponse = AdminQRListItem[];

export interface Table {
  id: string;
  number: string;
  status: "Active" | "Inactive";
  qrGenerated: boolean;
  qrCode?: string;
}

// ============================================================================
// User Profile Types (from old types)
// ============================================================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdateAddressRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

// ============================================================================
// Category Types (from JSON schema)
// ============================================================================
export interface Category {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  theme?: string;
  displayOrder: number;
  restaurantId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  displayOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  displayOrder?: number;
  active?: boolean;
}

// ============================================================================
// Supplier Types
// ============================================================================

export interface Supplier {
  id: string;
  name: string;
  category?: string;
  contact?: string;
  status: "Active" | "Inactive";
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Subscription Types
// ============================================================================

export interface Subscription {
  id: string;
  plan: string;
  status: "active" | "inactive" | "cancelled" | "expired" | "trial";
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  features: string[];
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd?: boolean;
  billingCycle?: "monthly" | "yearly";
  amount?: number;
  currency?: string;
  organizationName?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Order Types (from old types)
// ============================================================================

export interface CreateOrderRequest {
  customer: string;
  items: { itemId: string; quantity: number }[];
  orderType: "dine-in" | "takeout" | "delivery";
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
