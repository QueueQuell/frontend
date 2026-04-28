// Authentication Endpoints
export const ADMIN_BASE = "/v1/admin";

export const AUTH_ENDPOINTS = {
  LOGIN: `${ADMIN_BASE}/auth/login`,
  LOGOUT: `${ADMIN_BASE}/auth/logout`,
  REFRESH: `${ADMIN_BASE}/auth/refresh`,
  ME: `${ADMIN_BASE}/auth/me`,
};

// Inventory Endpoints
export const INVENTORY_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/inventory`,
  GET: (id: string) => `${ADMIN_BASE}/inventory/${id}`,
  CREATE: `${ADMIN_BASE}/inventory`,
  UPDATE: (id: string) => `${ADMIN_BASE}/inventory/${id}`,
  DELETE: (id: string) => `${ADMIN_BASE}/inventory/${id}`,
  ADJUST: `${ADMIN_BASE}/inventory/adjust`,
};

// Order Endpoints
export const ORDER_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/orders`,
  GET: (id: string) => `${ADMIN_BASE}/orders/${id}`,
  CREATE: `${ADMIN_BASE}/orders`,
  UPDATE: (id: string) => `${ADMIN_BASE}/orders/${id}`,
  DELETE: (id: string) => `${ADMIN_BASE}/orders/${id}`,
  UPDATE_STATUS: (id: string) => `${ADMIN_BASE}/orders/${id}/status`,
};

// Customer Endpoints
export const CUSTOMER_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/customers`,
  GET: (id: string) => `${ADMIN_BASE}/customers/${id}`,
  CREATE: `${ADMIN_BASE}/customers`,
  UPDATE: (id: string) => `${ADMIN_BASE}/customers/${id}`,
  DELETE: (id: string) => `${ADMIN_BASE}/customers/${id}`,
  LOYALTY: `${ADMIN_BASE}/customers/loyalty`,
  LOYALTY_POINTS: (id: string) =>
    `${ADMIN_BASE}/customers/${id}/loyalty-points`,
};

// Menu Item Endpoints
export const MENU_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/menu`,
  GET: (id: string) => `${ADMIN_BASE}/menu/${id}`,
  CREATE: `${ADMIN_BASE}/menu`,
  UPDATE: (id: string) => `${ADMIN_BASE}/menu/${id}`,
  DELETE: (id: string) => `${ADMIN_BASE}/menu/${id}`,
  CATALOG: `${ADMIN_BASE}/menu/catalog`,
};

// Supplier Endpoints
export const SUPPLIER_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/suppliers`,
  GET: (id: string) => `${ADMIN_BASE}/suppliers/${id}`,
  CREATE: `${ADMIN_BASE}/suppliers`,
  UPDATE: (id: string) => `${ADMIN_BASE}/suppliers/${id}`,
  DELETE: (id: string) => `${ADMIN_BASE}/suppliers/${id}`,
  PERFORMANCE: `${ADMIN_BASE}/suppliers/performance`,
  PROCUREMENT: `${ADMIN_BASE}/suppliers/procurement`,
};

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/payments`,
  GET: (id: string) => `${ADMIN_BASE}/payments/${id}`,
  CREATE: `${ADMIN_BASE}/payments`,
  HISTORY: `${ADMIN_BASE}/payments/history`,
  METHODS: `${ADMIN_BASE}/payments/methods`,
  UPDATE_METHOD: (id: string) => `${ADMIN_BASE}/payments/methods/${id}`,
  RECONCILIATION: `${ADMIN_BASE}/payments/reconciliation`,
};

// QR Code Endpoints
export const QR_ENDPOINTS = {
  GENERATE: `${ADMIN_BASE}/qr/generate`,
  LIST: `${ADMIN_BASE}/qr/list`,
  GET: (qrId: string) => `${ADMIN_BASE}/qr/${qrId}`,
  DEACTIVATE: (qrId: string) => `${ADMIN_BASE}/qr/${qrId}/deactivate`,
  REACTIVATE: (qrId: string) => `${ADMIN_BASE}/qr/${qrId}/reactivate`,
  DELETE: (qrId: string) => `${ADMIN_BASE}/qr/${qrId}`,
  TABLES: `${ADMIN_BASE}/qr/tables`,
  MENUS: `${ADMIN_BASE}/qr/menus`,
};

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${ADMIN_BASE}/users/profile`,
  UPDATE_PROFILE: `${ADMIN_BASE}/users/profile`,
  ADDRESS: `${ADMIN_BASE}/users/address`,
  UPDATE_ADDRESS: `${ADMIN_BASE}/users/address`,
  REGISTER: `${ADMIN_BASE}/auth/register`,
};

export const ADMIN_USER_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/users`,
  DETAIL: (id: string) => `${ADMIN_BASE}/users/${id}`,
  CREATE: `${ADMIN_BASE}/users`,
  UPDATE: (id: string) => `${ADMIN_BASE}/users/${id}`,
  DELETE: (id: string) => `${ADMIN_BASE}/users/${id}`,
};

// Organisation Endpoints
export const ORGANISATION_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/organisations`,
  GET: (id: string) => `${ADMIN_BASE}/organisations/${id}`,
  CREATE: `${ADMIN_BASE}/organisations`,
  UPDATE: (id: string) => `${ADMIN_BASE}/organisations/${id}`,
  DELETE: (id: string) => `${ADMIN_BASE}/organisations/${id}`,
};

// Category Endpoints
export const CATEGORY_ENDPOINTS = {
  LIST: `${ADMIN_BASE}/categories`,
  GET: (id: string) => `${ADMIN_BASE}/categories/${id}`,
  CREATE: `${ADMIN_BASE}/categories`,
  UPDATE: (id: string) => `${ADMIN_BASE}/categories/${id}`,
  DELETE: (id: string) => `${ADMIN_BASE}/categories/${id}`,
};
