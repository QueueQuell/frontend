"use client";

import {
  ApiError,
  ApiResponse,
  Pagination,
  UserListParams,
  UserListResponse,
} from "./types";
import { authService } from "./services/auth.service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type ApiRequestOptions = RequestInit & {
  skipAuth?: boolean;
  retryOn401?: boolean;
};

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  }

  private buildHeaders(
    headers: RequestInit["headers"],
    skipAuth = false,
  ): Headers {
    const built = new Headers(headers);
    built.set("Content-Type", "application/json");

    if (!skipAuth) {
      const token = this.getAuthToken();
      if (token?.trim()) {
        built.set("Authorization", `Bearer ${token}`);
      }
    }

    return built;
  }

  private subscribeTokenRefresh(cb: (token: string | null) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onTokenRefreshed(token: string | null) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private async clearAuthAndRedirect() {
    if (typeof window === "undefined") return;
    await authService.logout();
    sessionStorage.clear();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  private async refreshToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;

    try {
      await authService.refreshToken();
      return authService.getToken();
    } catch {
      await authService.logout();
      return null;
    }
  }

  private createApiError(data: any, status: number): ApiError {
    return {
      success: false,
      message: data?.message || data?.detail || "An error occurred",
      errors: data?.errors,
      status,
    };
  }

  private createNetworkError(error: any): ApiError {
    return {
      success: false,
      message: error?.message || "Network error occurred",
    };
  }

  private async waitForRefresh<T>(
    endpoint: string,
    options: ApiRequestOptions,
    headers: Headers,
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      this.subscribeTokenRefresh((newToken) => {
        if (!newToken) {
          reject({
            success: false,
            message: "Session expired. Please login again.",
            status: 401,
          } as ApiError);
          return;
        }

        headers.set("Authorization", `Bearer ${newToken}`);
        resolve(
          this.request<T>(endpoint, {
            ...options,
            headers,
            retryOn401: false,
          }),
        );
      });
    });
  }

  private async handle401<T>(
    endpoint: string,
    options: ApiRequestOptions,
    headers: Headers,
  ): Promise<ApiResponse<T>> {
    if (this.isRefreshing) {
      return this.waitForRefresh(endpoint, options, headers);
    }

    this.isRefreshing = true;
    try {
      const newToken = await this.refreshToken();

      if (!newToken) {
        this.onTokenRefreshed(null);
        await this.clearAuthAndRedirect();
        throw {
          success: false,
          message: "Session expired. Please login again.",
          status: 401,
        } as ApiError;
      }

      this.onTokenRefreshed(newToken);
      headers.set("Authorization", `Bearer ${newToken}`);
      return this.request<T>(endpoint, {
        ...options,
        headers,
        retryOn401: false,
      });
    } finally {
      this.isRefreshing = false;
    }
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { skipAuth, retryOn401 = true, ...fetchOptions } = options;
    const headers = this.buildHeaders(fetchOptions.headers, skipAuth);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      if (
        response.status === 401 &&
        typeof window !== "undefined" &&
        retryOn401
      ) {
        return this.handle401<T>(
          endpoint,
          {
            ...fetchOptions,
            skipAuth,
            retryOn401,
          },
          headers,
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw this.createApiError(data, response.status);
      }

      return {
        success: true,
        data: data.data ?? data,
        pagination: data.pagination,
        message: data.message,
      };
    } catch (error: any) {
      if (error?.success === false) throw error;
      throw this.createNetworkError(error);
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }

    return `${endpoint}?${new URLSearchParams(params).toString()}`;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>(url, { method: "GET", ...options });
  }

  private requestWithBody<T>(
    endpoint: string,
    method: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method,
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.requestWithBody<T>(endpoint, "POST", data, options);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.requestWithBody<T>(endpoint, "PUT", data, options);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.requestWithBody<T>(endpoint, "PATCH", data, options);
  }

  async delete<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", ...options });
  }

  async getPaginated<T = any>(
    endpoint: string,
    params: UserListParams,
  ): Promise<UserListResponse> {
    const queryParams = {
      page: "1",
      limit: "20",
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ),
    };

    const url = this.buildUrl(endpoint, queryParams);

    try {
      const response = await this.get<any>(url);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch data");
      }

      const items = Array.isArray(response.data)
        ? response.data
        : (response.data?.data ?? []);

      const paginationData = response.pagination ??
        response.data?.pagination ?? {
          page: Number(queryParams.page),
          limit: Number(queryParams.limit),
          total: items.length,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        };

      return {
        success: true,
        data: items,
        pagination: paginationData as Pagination,
      };
    } catch {
      return {
        success: false,
        data: [],
        pagination: {
          page: Number(queryParams.page),
          limit: Number(queryParams.limit),
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
