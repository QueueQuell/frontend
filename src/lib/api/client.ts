"use client";

import { ApiResponse, ApiError } from "./types";

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

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      if (data.data?.access_token) {
        localStorage.setItem("accessToken", data.data.access_token);
        if (data.data.refresh_token) {
          localStorage.setItem("refreshToken", data.data.refresh_token);
        }
        return data.data.access_token;
      }

      return null;
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

  async getWithMeta<T>(
    endpoint: string,
  ): Promise<ApiResponse<T> & { meta?: Record<string, any> }> {
    const token = this.getAuthToken();
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    if (token && token.trim()) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
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
            return this.getWithMeta<T>(endpoint);
          }
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

      const { data: responseData, total, page, limit, ...rest } = data;

      return {
        success: true,
        data: responseData || data,
        message: data.message,
        meta: { total, page, limit, ...rest },
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
}

export const apiClient = new ApiClient(API_BASE_URL);
