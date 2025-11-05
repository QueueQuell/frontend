// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',

    // Admin endpoints
    USERS: '/admin/users',
    ORGS: '/admin/orgs',
    STORES: '/admin/stores',

    // Inventory endpoints
    ITEMS: '/inventory/items',
    WAREHOUSES: '/inventory/warehouses',
    VENDORS: '/inventory/vendors',
    STOCK: '/inventory/stock',

    // Menu/Pricing endpoints
    MENU_PUBLISH: '/api/menu/publish',
    MENU_AVAILABILITY: '/api/menu/items',
    PRICING_BOOKS: '/api/pricing/books',
    TAX_PROFILES: '/api/tax/profiles',
    TAX_HSN: '/api/tax/hsn',
    PRICING_SURCHARGES: '/api/pricing/surcharges',

    // POS/QR endpoints
    QR_GENERATE: '/api/pos/qr/generate',
    QR_SCAN: '/api/pos/qr/scan',
    CART: '/api/pos/cart',
    POS_ORDERS: '/api/pos/orders',

    // Orders endpoints
    ORDERS: '/api/orders',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API utility functions
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

export const getAuthHeaders = (token?: string) => {
  const accessToken = token || localStorage.getItem('accessToken');
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const getOrgHeaders = (orgId?: string) => {
  const xOrgId = orgId || localStorage.getItem('orgId');
  return xOrgId ? { 'X-Org-Id': xOrgId } : {};
};
