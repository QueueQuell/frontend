// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/v1/admin/auth/login",
  LOGOUT: "/v1/admin/auth/logout",
  REFRESH: "/v1/admin/auth/refresh",
  ME: "/v1/admin/auth/me",
};

// Inventory Endpoints
export const INVENTORY_ENDPOINTS = {
  LIST: "/v1/admin/inventory",
  GET: (id: string) => `/v1/admin/inventory/${id}`,
  CREATE: "/v1/admin/inventory",
  UPDATE: (id: string) => `/v1/admin/inventory/${id}`,
  DELETE: (id: string) => `/v1/admin/inventory/${id}`,
  ADJUST: "/v1/admin/inventory/adjust",
};

// Order Endpoints
export const ORDER_ENDPOINTS = {
  LIST: "/v1/admin/orders",
  GET: (id: string) => `/v1/admin/orders/${id}`,
  CREATE: "/v1/admin/orders",
  UPDATE: (id: string) => `/v1/admin/orders/${id}`,
  DELETE: (id: string) => `/v1/admin/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/v1/admin/orders/${id}/status`,
};

// Customer Endpoints
export const CUSTOMER_ENDPOINTS = {
  LIST: "/v1/admin/customers",
  GET: (id: string) => `/v1/admin/customers/${id}`,
  CREATE: "/v1/admin/customers",
  UPDATE: (id: string) => `/v1/admin/customers/${id}`,
  DELETE: (id: string) => `/v1/admin/customers/${id}`,
  LOYALTY: "/v1/admin/customers/loyalty",
  LOYALTY_POINTS: (id: string) => `/v1/admin/customers/${id}/loyalty-points`,
};

// Menu Item Endpoints
export const MENU_ENDPOINTS = {
  LIST: "/v1/admin/menu",
  GET: (id: string) => `/v1/admin/menu/${id}`,
  CREATE: "/v1/admin/menu",
  UPDATE: (id: string) => `/v1/admin/menu/${id}`,
  DELETE: (id: string) => `/v1/admin/menu/${id}`,
  CATALOG: "/v1/admin/menu/catalog",
};

// Supplier Endpoints
export const SUPPLIER_ENDPOINTS = {
  LIST: "/v1/admin/suppliers",
  GET: (id: string) => `/v1/admin/suppliers/${id}`,
  CREATE: "/v1/admin/suppliers",
  UPDATE: (id: string) => `/v1/admin/suppliers/${id}`,
  DELETE: (id: string) => `/v1/admin/suppliers/${id}`,
  PERFORMANCE: "/v1/admin/suppliers/performance",
  PROCUREMENT: "/v1/admin/suppliers/procurement",
};

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  LIST: "/v1/admin/payments",
  GET: (id: string) => `/v1/admin/payments/${id}`,
  CREATE: "/v1/admin/payments",
  HISTORY: "/v1/admin/payments/history",
  METHODS: "/v1/admin/payments/methods",
  UPDATE_METHOD: (id: string) => `/v1/admin/payments/methods/${id}`,
  RECONCILIATION: "/v1/admin/payments/reconciliation",
};

// QR Code Endpoints
export const QR_ENDPOINTS = {
  GENERATE: "/v1/admin/qr/generate",
  LIST: "/v1/admin/qr/list",
  GET: (id: string) => `/v1/admin/qr/${id}`,
  DELETE: (id: string) => `/v1/admin/qr/${id}`,
  TABLES: "/v1/admin/qr/tables",
  MENUS: "/v1/admin/qr/menus",
};

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: "/v1/admin/users/profile",
  UPDATE_PROFILE: "/v1/admin/users/profile",
  ADDRESS: "/v1/admin/users/address",
  UPDATE_ADDRESS: "/v1/admin/users/address",
  REGISTER: "/v1/admin/auth/register",
};

export const ADMIN_USER_ENDPOINTS = {
  LIST: "/v1/admin/users",
  DETAIL: (id: string) => `/v1/admin/users/${id}`,
  CREATE: "/v1/admin/users",
  UPDATE: (id: string) => `/v1/admin/users/${id}`,
  DELETE: (id: string) => `/v1/admin/users/${id}`,
};

// Organisation Endpoints
export const ORGANISATION_ENDPOINTS = {
  LIST: "/v1/admin/organisations",
  GET: (id: string) => `/v1/admin/organisations/${id}`,
  CREATE: "/v1/admin/organisations",
  UPDATE: (id: string) => `/v1/admin/organisations/${id}`,
  DELETE: (id: string) => `/v1/admin/organisations/${id}`,
};

// Category Endpoints
export const CATEGORY_ENDPOINTS = {
  LIST: "/v1/admin/categories",
  GET: (id: string) => `/v1/admin/categories/${id}`,
  CREATE: "/v1/admin/categories",
  UPDATE: (id: string) => `/v1/admin/categories/${id}`,
  DELETE: (id: string) => `/v1/admin/categories/${id}`,
};
