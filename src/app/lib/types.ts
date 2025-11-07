/**
 * API Types Module
 * TypeScript interfaces for API requests and responses
 * Based on OpenAPI specification
 */

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginRequest {
  username_or_email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface UserCreate {
  name: string;
  email: string;
  role?: string;
  password: string;
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
  error?: string;
  message?: string;
  success?: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  size: number;
  hasMore?: boolean;
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
  category?: string;
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
  type: 'percentage' | 'fixed';
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
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

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
  order?: 'asc' | 'desc';
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
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
