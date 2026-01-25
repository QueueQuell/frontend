/**
 * Token Management Module
 * Handles secure token storage, retrieval, and refresh logic
 * Safe for both client and server-side rendering
 */

import { AuthError, ApiErrorCode } from './errors';

/**
 * Token storage keys
 */
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_TYPE: 'tokenType',
  ORG_ID: 'orgId',
  TOKEN_EXPIRY: 'tokenExpiry',
} as const;

/**
 * Check if we're running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Safe localStorage wrapper
 */
class StorageManager {
  private memoryStorage: Map<string, string> = new Map();

  get(key: string): string | null {
    if (isBrowser()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage access failed, using memory storage', e);
        return this.memoryStorage.get(key) || null;
      }
    }
    return this.memoryStorage.get(key) || null;
  }

  set(key: string, value: string): void {
    if (isBrowser()) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('localStorage write failed, using memory storage', e);
        this.memoryStorage.set(key, value);
      }
    } else {
      this.memoryStorage.set(key, value);
    }
  }

  remove(key: string): void {
    if (isBrowser()) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('localStorage remove failed, using memory storage', e);
        this.memoryStorage.delete(key);
      }
    } else {
      this.memoryStorage.delete(key);
    }
  }

  clear(): void {
    if (isBrowser()) {
      try {
        // Only clear our tokens, not all localStorage
        Object.values(TOKEN_KEYS).forEach(key => localStorage.removeItem(key));
      } catch (e) {
        console.warn('localStorage clear failed, using memory storage', e);
        this.memoryStorage.clear();
      }
    } else {
      this.memoryStorage.clear();
    }
  }
}

const storage = new StorageManager();

/**
 * Token refresh state management
 */
class TokenRefreshManager {
  private refreshPromise: Promise<string> | null = null;
  private refreshCallback: (() => Promise<string>) | null = null;

  /**
   * Set the refresh callback function
   */
  setRefreshCallback(callback: () => Promise<string>): void {
    this.refreshCallback = callback;
  }

  /**
   * Get or create a refresh promise to prevent multiple simultaneous refresh requests
   */
  async getOrRefresh(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start new refresh
    if (!this.refreshCallback) {
      throw new AuthError(
        'Token refresh callback not configured',
        ApiErrorCode.REFRESH_FAILED
      );
    }

    this.refreshPromise = this.refreshCallback()
      .then(token => {
        this.refreshPromise = null;
        return token;
      })
      .catch(error => {
        this.refreshPromise = null;
        throw error;
      });

    return this.refreshPromise;
  }

  /**
   * Check if currently refreshing
   */
  isRefreshing(): boolean {
    return this.refreshPromise !== null;
  }

  /**
   * Clear refresh state
   */
  clear(): void {
    this.refreshPromise = null;
  }
}

const refreshManager = new TokenRefreshManager();

/**
 * Token Manager class
 */
export class TokenManager {
  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    return storage.get(TOKEN_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    return storage.get(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * Get token type
   */
  static getTokenType(): string {
    return storage.get(TOKEN_KEYS.TOKEN_TYPE) || 'Bearer';
  }

  /**
   * Get organization ID
   */
  static getOrgId(): string | null {
    return storage.get(TOKEN_KEYS.ORG_ID);
  }

  /**
   * Set tokens
   */
  static setTokens(
    accessToken: string,
    refreshToken: string,
    tokenType: string = 'Bearer',
    expiresIn?: number
  ): void {
    storage.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    storage.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    storage.set(TOKEN_KEYS.TOKEN_TYPE, tokenType);

    // Calculate and store expiry time if provided
    if (expiresIn) {
      const expiryTime = Date.now() + expiresIn * 1000;
      storage.set(TOKEN_KEYS.TOKEN_EXPIRY, expiryTime.toString());
    }
  }

  /**
   * Set organization ID
   */
  static setOrgId(orgId: string): void {
    storage.set(TOKEN_KEYS.ORG_ID, orgId);
  }

  /**
   * Clear all tokens
   */
  static clearTokens(): void {
    storage.clear();
    refreshManager.clear();
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  static isTokenExpired(): boolean {
    const expiryStr = storage.get(TOKEN_KEYS.TOKEN_EXPIRY);
    if (!expiryStr) {
      // If no expiry stored, assume token is valid
      return false;
    }

    const expiry = parseInt(expiryStr, 10);
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

    return now >= expiry - bufferTime;
  }

  /**
   * Get authorization header
   */
  static getAuthHeader(): Record<string, string> {
    const token = this.getAccessToken();
    if (!token) {
      return {};
    }

    const tokenType = this.getTokenType();
    return {
      Authorization: `${tokenType} ${token}`,
    };
  }

  /**
   * Get organization header
   */
  static getOrgHeader(): Record<string, string> {
    const orgId = this.getOrgId();
    if (!orgId) {
      return {};
    }

    return {
      'X-Org-Id': orgId,
    };
  }

  /**
   * Get all auth headers (Authorization + X-Org-Id)
   */
  static getAllHeaders(): Record<string, string> {
    return {
      ...this.getAuthHeader(),
      ...this.getOrgHeader(),
    };
  }

  /**
   * Set token refresh callback
   */
  static setRefreshCallback(callback: () => Promise<string>): void {
    refreshManager.setRefreshCallback(callback);
  }

  /**
   * Refresh token if needed
   * Returns the current or new access token
   */
  static async refreshIfNeeded(): Promise<string> {
    const accessToken = this.getAccessToken();

    // No token, can't refresh
    if (!accessToken) {
      throw new AuthError('No access token available', ApiErrorCode.UNAUTHORIZED);
    }

    // Token not expired, return current token
    if (!this.isTokenExpired()) {
      return accessToken;
    }

    // Token expired, refresh it
    return refreshManager.getOrRefresh();
  }

  /**
   * Check if currently refreshing token
   */
  static isRefreshing(): boolean {
    return refreshManager.isRefreshing();
  }

  /**
   * Decode JWT token (without verification)
   * Used to extract expiry and other claims
   */
  static decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  /**
   * Get token expiry from JWT
   */
  static getTokenExpiry(token?: string): number | null {
    const tokenToCheck = token || this.getAccessToken();
    if (!tokenToCheck) {
      return null;
    }

    const decoded = this.decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return decoded.exp * 1000; // Convert to milliseconds
  }

  /**
   * Update token expiry in storage based on JWT
   */
  static updateExpiryFromToken(token?: string): void {
    const expiry = this.getTokenExpiry(token);
    if (expiry) {
      storage.set(TOKEN_KEYS.TOKEN_EXPIRY, expiry.toString());
    }
  }
}

// Export for backward compatibility
export const getAuthHeaders = (token?: string): Record<string, string> => {
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return TokenManager.getAuthHeader();
};

export const getOrgHeaders = (orgId?: string): Record<string, string> => {
  if (orgId) {
    return { 'X-Org-Id': orgId };
  }
  return TokenManager.getOrgHeader();
};
