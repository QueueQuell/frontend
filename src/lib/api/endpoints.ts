// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
};

// Inventory Endpoints
export const INVENTORY_ENDPOINTS = {
  LIST: "/inventory",
  GET: (id: string) => `/inventory/${id}`,
  CREATE: "/inventory",
  UPDATE: (id: string) => `/inventory/${id}`,
  DELETE: (id: string) => `/inventory/${id}`,
  ADJUST: "/inventory/adjust",
};

// Order Endpoints
export const ORDER_ENDPOINTS = {
  LIST: "/orders",
  GET: (id: string) => `/orders/${id}`,
  CREATE: "/orders",
  UPDATE: (id: string) => `/orders/${id}`,
  DELETE: (id: string) => `/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
};

// Customer Endpoints
export const CUSTOMER_ENDPOINTS = {
  LIST: "/customers",
  GET: (id: string) => `/customers/${id}`,
  CREATE: "/customers",
  UPDATE: (id: string) => `/customers/${id}`,
  DELETE: (id: string) => `/customers/${id}`,
  LOYALTY: "/customers/loyalty",
  LOYALTY_POINTS: (id: string) => `/customers/${id}/loyalty-points`,
};

// Menu Item Endpoints
export const MENU_ENDPOINTS = {
  LIST: "/menu-items",
  GET: (id: string) => `/menu-items/${id}`,
  CREATE: "/menu-items",
  UPDATE: (id: string) => `/menu-items/${id}`,
  DELETE: (id: string) => `/menu-items/${id}`,
  CATALOG: "/menu-items/catalog",
};

// Supplier Endpoints
export const SUPPLIER_ENDPOINTS = {
  LIST: "/suppliers",
  GET: (id: string) => `/suppliers/${id}`,
  CREATE: "/suppliers",
  UPDATE: (id: string) => `/suppliers/${id}`,
  DELETE: (id: string) => `/suppliers/${id}`,
  PERFORMANCE: "/suppliers/performance",
  PROCUREMENT: "/suppliers/procurement",
};

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  LIST: "/payments",
  GET: (id: string) => `/payments/${id}`,
  CREATE: "/payments",
  HISTORY: "/payments/history",
  METHODS: "/payments/methods",
  UPDATE_METHOD: (id: string) => `/payments/methods/${id}`,
  RECONCILIATION: "/payments/reconciliation",
};

// QR Code Endpoints
export const QR_ENDPOINTS = {
  GENERATE: "/qr/generate",
  LIST: "/qr",
  GET: (id: string) => `/qr/${id}`,
  DELETE: (id: string) => `/qr/${id}`,
  TABLES: "/qr/tables",
  MENUS: "/qr/menus",
};

// Admin QR Code Endpoints
export const ADMIN_QR_ENDPOINTS = {
  GENERATE: "/admin/qr/generate",
  LIST: "/admin/qr/list",
};

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  ADDRESS: "/users/address",
  UPDATE_ADDRESS: "/users/address",
};
