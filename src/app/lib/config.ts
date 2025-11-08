/**
 * API Configuration Module
 * Central configuration for API client and endpoints
 */

import { TokenManager } from './tokenManager';

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
    BACKOFF: 2, // Exponential backoff multiplier
  },
  CACHE: {
    ENABLED: true,
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    MAX_SIZE: 100,
  },
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
  },
};

/**
 * Helper function to get full API URL
 * @param endpoint - API endpoint path
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Get auth headers (backward compatibility)
 * @deprecated Use TokenManager.getAuthHeader() instead
 */
export const getAuthHeaders = (token?: string): Record<string, string> => {
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return TokenManager.getAuthHeader();
};

/**
 * Get org headers (backward compatibility)
 * @deprecated Use TokenManager.getOrgHeader() instead
 */
export const getOrgHeaders = (orgId?: string): Record<string, string> => {
  if (orgId) {
    return { 'X-Org-Id': orgId };
  }
  return TokenManager.getOrgHeader();
};
