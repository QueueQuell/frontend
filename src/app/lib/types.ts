// API Types based on OpenAPI spec

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

// Generic response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
