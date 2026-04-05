"use client";

import {
  ApiResponse,
  ApiError,
  Pagination,
  UserListResponse,
  UserListParams,
} from "./types";
import { authService } from "./services/auth.service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private async refreshToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;

    try {
      await authService.refreshToken();
      return authService.getToken();
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenType");

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (token && token.trim()) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401 && typeof window !== "undefined") {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            headers.set("Authorization", `Bearer ${newToken}`);
            return this.request<T>(endpoint, { ...options, headers });
          }
        } else {
          return new Promise((resolve) => {
            this.subscribeTokenRefresh((newToken) => {
              headers.set("Authorization", `Bearer ${newToken}`);
              resolve(this.request<T>(endpoint, { ...options, headers }));
            });
          });
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || data.detail || "An error occurred",
          errors: data.errors,
        } as ApiError;
      }

      return {
        success: true,
        data: data.data || data,
        pagination: data.pagination,
        message: data.message,
      };
    } catch (error: any) {
      if (error.success === false) {
        throw error;
      }
      throw {
        success: false,
        message: error.message || "Network error occurred",
      } as ApiError;
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async getPaginated<T = any>(
    endpoint: string,
    params: UserListParams,
  ): Promise<UserListResponse> {
    // Ensure page and limit are strings for URL params
    const queryParams = {
      page: "1",
      limit: "20",
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ),
    };

    let url = endpoint;
    const searchParams = new URLSearchParams(queryParams);
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }

    try {
      const response = await this.get<any>(url);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch data");
      }

      // Backend returns { success, data: T[], pagination }
      // request() extracts data.data || data, so adjust
      const items = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      console.log(JSON.stringify(response, null, 2));
      const paginationData = response.pagination ||
        response.data?.pagination || {
          page: parseInt(queryParams.page || "1"),
          limit: parseInt(queryParams.limit || "20"),
          total: items.length,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        };

      console.log(JSON.stringify(paginationData, null, 2));

      return {
        success: true,
        data: items,
        pagination: paginationData as Pagination,
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        pagination: {
          page: parseInt(queryParams.page || "1"),
          limit: parseInt(queryParams.limit || "20"),
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
