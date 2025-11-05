import { getApiUrl, getAuthHeaders, getOrgHeaders } from './config';
import type {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  UserCreate,
  UserUpdate,
  OrgCreate,
  OrgOut,
  StoreCreate,
  StoreOut,
  ItemCreate,
  ItemOut,
  ItemUpdate,
  WarehouseCreate,
  WarehouseOut,
  VendorCreate,
  VendorOut,
  StockAdjustment,
  StockLevel,
  BatchCreate,
  BatchOut,
  PublishMenu,
  SetAvailability,
  QRGenerate,
  CheckoutRequest,
  SplitBill,
  PromiseTime,
  StageUpdate,
  ApiResponse,
  PaginatedResponse,
} from './types';

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = true,
  includeOrg = true
): Promise<T> => {
  const url = getApiUrl(endpoint);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const authHeaders = getAuthHeaders();
    Object.assign(headers, authHeaders);
  }

  if (includeOrg) {
    const orgHeaders = getOrgHeaders();
    Object.assign(headers, orgHeaders);
  }

  // Merge with any additional headers from options
  if (options.headers) {
    Object.assign(headers, options.headers as Record<string, string>);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }, false, false),

  refresh: (data: RefreshRequest): Promise<LoginResponse> =>
    apiRequest<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    }, false, false),

  logout: (data: RefreshRequest): Promise<void> =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Admin API
export const adminApi = {
  // Users
  getUsers: (): Promise<any[]> =>
    apiRequest<any[]>('/admin/users'),

  createUser: (data: UserCreate): Promise<any> =>
    apiRequest<any>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUser: (data: UserUpdate): Promise<any> =>
    apiRequest<any>('/admin/users', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string): Promise<void> =>
    apiRequest<void>(`/admin/users?id=${id}`, {
      method: 'DELETE',
    }),

  // Organizations
  getOrgs: (): Promise<any[]> =>
    apiRequest<any[]>('/admin/orgs'),

  createOrg: (data: OrgCreate): Promise<any> =>
    apiRequest<any>('/admin/orgs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateOrg: (data: OrgOut): Promise<any> =>
    apiRequest<any>('/admin/orgs', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteOrg: (id: string): Promise<void> =>
    apiRequest<void>(`/admin/orgs?id=${id}`, {
      method: 'DELETE',
    }),

  // Stores
  getStores: (): Promise<any[]> =>
    apiRequest<any[]>('/admin/stores'),

  createStore: (data: StoreCreate): Promise<any> =>
    apiRequest<any>('/admin/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStore: (data: StoreOut): Promise<any> =>
    apiRequest<any>('/admin/stores', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteStore: (id: string): Promise<void> =>
    apiRequest<void>(`/admin/stores?id=${id}`, {
      method: 'DELETE',
    }),
};

// Inventory API
export const inventoryApi = {
  // Items
  getItems: (params?: { q?: string; limit?: number; offset?: number }): Promise<ItemOut[]> => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());

    return apiRequest<ItemOut[]>(`/inventory/items?${query.toString()}`);
  },

  createItem: (data: ItemCreate): Promise<ItemOut> =>
    apiRequest<ItemOut>('/inventory/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getItem: (id: string): Promise<ItemOut> =>
    apiRequest<ItemOut>(`/inventory/items/${id}`),

  updateItem: (id: string, data: ItemUpdate): Promise<ItemOut> =>
    apiRequest<ItemOut>(`/inventory/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteItem: (id: string): Promise<void> =>
    apiRequest<void>(`/inventory/items/${id}`, {
      method: 'DELETE',
    }),

  // Warehouses
  getWarehouses: (params?: { q?: string; limit?: number; offset?: number }): Promise<WarehouseOut[]> => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());

    return apiRequest<WarehouseOut[]>(`/inventory/warehouses?${query.toString()}`);
  },

  createWarehouse: (data: WarehouseCreate): Promise<WarehouseOut> =>
    apiRequest<WarehouseOut>('/inventory/warehouses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getWarehouse: (id: string): Promise<WarehouseOut> =>
    apiRequest<WarehouseOut>(`/inventory/warehouses/${id}`),

  updateWarehouse: (id: string, data: WarehouseCreate): Promise<WarehouseOut> =>
    apiRequest<WarehouseOut>(`/inventory/warehouses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteWarehouse: (id: string): Promise<void> =>
    apiRequest<void>(`/inventory/warehouses/${id}`, {
      method: 'DELETE',
    }),

  // Vendors
  getVendors: (): Promise<VendorOut[]> =>
    apiRequest<VendorOut[]>('/inventory/vendors'),

  createVendor: (data: VendorCreate): Promise<VendorOut> =>
    apiRequest<VendorOut>('/inventory/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getVendor: (id: string): Promise<VendorOut> =>
    apiRequest<VendorOut>(`/inventory/vendors/${id}`),

  updateVendor: (id: string, data: VendorCreate): Promise<VendorOut> =>
    apiRequest<VendorOut>(`/inventory/vendors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteVendor: (id: string): Promise<void> =>
    apiRequest<void>(`/inventory/vendors/${id}`, {
      method: 'DELETE',
    }),

  // Stock Management
  adjustStock: (itemId: string, data: StockAdjustment): Promise<StockLevel> =>
    apiRequest<StockLevel>(`/inventory/items/${itemId}/stock`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStockLevels: (itemId: string, warehouseId?: string): Promise<StockLevel[]> => {
    const query = warehouseId ? `?warehouse_id=${warehouseId}` : '';
    return apiRequest<StockLevel[]>(`/inventory/items/${itemId}/stock${query}`);
  },

  getStock: (params: { item_id: string; warehouse_id?: string }): Promise<StockLevel[]> => {
    const query = new URLSearchParams();
    query.append('item_id', params.item_id);
    if (params.warehouse_id) query.append('warehouse_id', params.warehouse_id);

    return apiRequest<StockLevel[]>(`/inventory/stock?${query.toString()}`);
  },

  // Batches
  createBatch: (itemId: string, data: BatchCreate): Promise<BatchOut> =>
    apiRequest<BatchOut>(`/inventory/items/${itemId}/batches`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getBatches: (itemId: string): Promise<BatchOut[]> =>
    apiRequest<BatchOut[]>(`/inventory/items/${itemId}/batches`),
};

// Menu/Pricing API
export const menuApi = {
  publishMenu: (data: PublishMenu): Promise<any> =>
    apiRequest<any>('/api/menu/publish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  setAvailability: (itemId: string, data: SetAvailability): Promise<any> =>
    apiRequest<any>(`/api/menu/items/${itemId}/availability`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const pricingApi = {
  // Pricing Books
  getPricingBooks: (): Promise<any[]> =>
    apiRequest<any[]>('/api/pricing/books'),

  createPricingBook: (data: any): Promise<any> =>
    apiRequest<any>('/api/pricing/books', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePricingBook: (data: any): Promise<any> =>
    apiRequest<any>('/api/pricing/books', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePricingBook: (id: string): Promise<void> =>
    apiRequest<void>(`/api/pricing/books?id=${id}`, {
      method: 'DELETE',
    }),

  // Tax Profiles
  getTaxProfiles: (): Promise<any[]> =>
    apiRequest<any[]>('/api/tax/profiles'),

  createTaxProfile: (data: any): Promise<any> =>
    apiRequest<any>('/api/tax/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTaxProfile: (data: any): Promise<any> =>
    apiRequest<any>('/api/tax/profiles', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteTaxProfile: (id: string): Promise<void> =>
    apiRequest<void>(`/api/tax/profiles?id=${id}`, {
      method: 'DELETE',
    }),

  // HSN Codes
  getHsnCodes: (): Promise<any[]> =>
    apiRequest<any[]>('/api/tax/hsn'),

  createHsnCode: (data: any): Promise<any> =>
    apiRequest<any>('/api/tax/hsn', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateHsnCode: (data: any): Promise<any> =>
    apiRequest<any>('/api/tax/hsn', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteHsnCode: (id: string): Promise<void> =>
    apiRequest<void>(`/api/tax/hsn?id=${id}`, {
      method: 'DELETE',
    }),

  // Surcharges
  getSurcharges: (): Promise<any[]> =>
    apiRequest<any[]>('/api/pricing/surcharges'),

  createSurcharge: (data: any): Promise<any> =>
    apiRequest<any>('/api/pricing/surcharges', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSurcharge: (data: any): Promise<any> =>
    apiRequest<any>('/api/pricing/surcharges', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteSurcharge: (id: string): Promise<void> =>
    apiRequest<void>(`/api/pricing/surcharges?id=${id}`, {
      method: 'DELETE',
    }),
};

// POS/QR API
export const posApi = {
  generateQR: (data: QRGenerate): Promise<any> =>
    apiRequest<any>('/api/pos/qr/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  scanQR: (qrToken: string): Promise<any> =>
    apiRequest<any>(`/api/pos/qr/scan?qr_token=${qrToken}`),

  getCart: (cartId: string): Promise<any> =>
    apiRequest<any>(`/api/pos/cart/${cartId}`),

  removeFromCart: (cartId: string, itemId: string): Promise<any> =>
    apiRequest<any>(`/api/pos/cart/${cartId}/remove/${itemId}`, {
      method: 'DELETE',
    }),

  getCartTotal: (cartId: string): Promise<any> =>
    apiRequest<any>(`/api/pos/cart/${cartId}/total`),

  createOrder: (data: CheckoutRequest): Promise<any> =>
    apiRequest<any>('/api/pos/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  splitBill: (orderId: string, data: SplitBill): Promise<any> =>
    apiRequest<any>(`/api/pos/orders/${orderId}/split`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Orders API
export const ordersApi = {
  getOrder: (orderId: string): Promise<any> =>
    apiRequest<any>(`/api/orders/${orderId}`),

  getOrderTimeline: (orderId: string): Promise<any> =>
    apiRequest<any>(`/api/orders/${orderId}/timeline`),

  setPromiseTime: (orderId: string, data: PromiseTime): Promise<any> =>
    apiRequest<any>(`/api/orders/${orderId}/promise-time`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  setStage: (orderId: string, data: StageUpdate): Promise<any> =>
    apiRequest<any>(`/api/orders/${orderId}/stage`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
