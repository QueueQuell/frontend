/**
 * Enhanced API Client Module
 * Provides a robust HTTP client with interceptors, retry logic, and automatic token refresh
 */

import { TokenManager } from './tokenManager';
import {
  ApiError,
  ApiErrorCode,
  NetworkError,
  TimeoutError,
  AuthError,
  parseErrorFromResponse,
  parseErrorFromException,
  isAuthError,
} from './errors';

/**
 * Request configuration options
 */
export interface RequestConfig extends Omit<RequestInit, 'cache'> {
  timeout?: number;
  retry?: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
  };
  cacheConfig?: {
    enabled?: boolean;
    ttl?: number;
    key?: string;
  };
  includeAuth?: boolean;
  includeOrg?: boolean;
  skipRefresh?: boolean;
}

/**
 * Request interceptor function type
 */
export type RequestInterceptor = (
  url: string,
  config: RequestConfig
) => Promise<{ url: string; config: RequestConfig }> | { url: string; config: RequestConfig };

/**
 * Response interceptor function type
 */
export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

/**
 * Error interceptor function type
 */
export type ErrorInterceptor = (error: ApiError) => Promise<never> | never;

/**
 * API Client configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retry?: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
  };
  headers?: Record<string, string>;
  onTokenRefresh?: () => Promise<string>;
}

/**
 * Enhanced API Client class
 */
export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetry: {
    maxAttempts: number;
    delay: number;
    backoff: number;
  };
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private pendingRequests: Map<string, AbortController> = new Map();

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultTimeout = config.timeout || 30000; // 30 seconds
    this.defaultRetry = {
      maxAttempts: config.retry?.maxAttempts ?? 3,
      delay: config.retry?.delay ?? 1000,
      backoff: config.retry?.backoff ?? 2,
    };
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Set up token refresh callback
    if (config.onTokenRefresh) {
      TokenManager.setRefreshCallback(config.onTokenRefresh);
    }

    // Add default interceptors
    this.addDefaultInterceptors();
  }

  /**
   * Add default request/response interceptors
   */
  private addDefaultInterceptors(): void {
    // Request interceptor: Add auth headers
    this.addRequestInterceptor(async (url, config) => {
      const headers = { ...config.headers } as Record<string, string>;

      // Add auth headers if needed
      if (config.includeAuth !== false) {
        Object.assign(headers, TokenManager.getAuthHeader());
      }

      // Add org headers if needed
      if (config.includeOrg !== false) {
        Object.assign(headers, TokenManager.getOrgHeader());
      }

      return {
        url,
        config: { ...config, headers },
      };
    });

    // Response interceptor: Handle token refresh
    this.addResponseInterceptor(async (response) => {
      // If unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && !response.url.includes('/auth/refresh')) {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          try {
            // Refresh the token
            await TokenManager.refreshIfNeeded();
            
            // Retry the original request with new token
            const newResponse = await fetch(response.url, {
              ...response,
              headers: {
                ...Object.fromEntries(response.headers.entries()),
                ...TokenManager.getAuthHeader(),
              },
            });
            
            return newResponse;
          } catch (error) {
            // Refresh failed, clear tokens and throw
            TokenManager.clearTokens();
            throw new AuthError(
              'Session expired. Please log in again.',
              ApiErrorCode.TOKEN_EXPIRED
            );
          }
        }
      }

      return response;
    });
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Build full URL
   */
  private buildURL(endpoint: string): string {
    // If endpoint is already a full URL, return as is
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }

    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Remove trailing slash from baseURL if present
    const cleanBaseURL = this.baseURL.endsWith('/') 
      ? this.baseURL.slice(0, -1) 
      : this.baseURL;

    return `${cleanBaseURL}/${cleanEndpoint}`;
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(
    url: string,
    config: RequestConfig
  ): Promise<{ url: string; config: RequestConfig }> {
    let currentUrl = url;
    let currentConfig = config;

    for (const interceptor of this.requestInterceptors) {
      const result = await interceptor(currentUrl, currentConfig);
      currentUrl = result.url;
      currentConfig = result.config;
    }

    return { url: currentUrl, config: currentConfig };
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let currentResponse = response;

    for (const interceptor of this.responseInterceptors) {
      currentResponse = await interceptor(currentResponse);
    }

    return currentResponse;
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(error: ApiError): Promise<never> {
    let currentError = error;

    for (const interceptor of this.errorInterceptors) {
      try {
        await interceptor(currentError);
      } catch (e) {
        if (e instanceof ApiError) {
          currentError = e;
        }
      }
    }

    throw currentError;
  }

  /**
   * Create abort controller with timeout
   */
  private createAbortController(timeout: number): AbortController {
    const controller = new AbortController();
    
    setTimeout(() => {
      controller.abort();
    }, timeout);

    return controller;
  }

  /**
   * Sleep for retry delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    url: string,
    config: RequestConfig,
    attempt: number = 1
  ): Promise<T> {
    const timeout = config.timeout || this.defaultTimeout;
    const retry = {
      maxAttempts: config.retry?.maxAttempts ?? this.defaultRetry.maxAttempts,
      delay: config.retry?.delay ?? this.defaultRetry.delay,
      backoff: config.retry?.backoff ?? this.defaultRetry.backoff,
    };
    
    // Create abort controller
    const controller = this.createAbortController(timeout);
    const requestKey = `${config.method || 'GET'}-${url}`;
    
    // Store controller for potential cancellation
    this.pendingRequests.set(requestKey, controller);

    try {
      // Apply request interceptors
      const { url: interceptedUrl, config: interceptedConfig } = 
        await this.applyRequestInterceptors(url, config);

      // Merge headers
      const headers = {
        ...this.defaultHeaders,
        ...interceptedConfig.headers,
      };

      // Make request
      const response = await fetch(interceptedUrl, {
        ...interceptedConfig,
        headers,
        signal: controller.signal,
      });

      // Apply response interceptors
      const interceptedResponse = await this.applyResponseInterceptors(response);

      // Check if response is ok
      if (!interceptedResponse.ok) {
        const error = await parseErrorFromResponse(interceptedResponse);
        
        // Retry if error is retryable and we haven't exceeded max attempts
        if (error.isRetryable() && attempt < retry.maxAttempts) {
          const delay = retry.delay * Math.pow(retry.backoff, attempt - 1);
          await this.sleep(delay);
          return this.executeWithRetry<T>(url, config, attempt + 1);
        }

        throw error;
      }

      // Parse response
      const contentType = interceptedResponse.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return interceptedResponse.json();
      }

      // Return empty object for non-JSON responses (like 204 No Content)
      return {} as T;

    } catch (error: any) {
      // Handle abort/timeout
      if (error.name === 'AbortError') {
        throw new TimeoutError(`Request timeout after ${timeout}ms`);
      }

      // Parse error
      const apiError = parseErrorFromException(error);

      // Retry if error is retryable and we haven't exceeded max attempts
      if (apiError.isRetryable() && attempt < retry.maxAttempts) {
        const delay = retry.delay * Math.pow(retry.backoff, attempt - 1);
        await this.sleep(delay);
        return this.executeWithRetry<T>(url, config, attempt + 1);
      }

      // Apply error interceptors
      await this.applyErrorInterceptors(apiError);

      throw apiError;
    } finally {
      // Clean up
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = this.buildURL(endpoint);
    return this.executeWithRetry<T>(url, config);
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Cancel pending request
   */
  cancelRequest(method: string, url: string): void {
    const requestKey = `${method}-${url}`;
    const controller = this.pendingRequests.get(requestKey);
    
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.pendingRequests.forEach(controller => controller.abort());
    this.pendingRequests.clear();
  }
}

/**
 * Create default API client instance
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
