"use client";

import { apiClient } from "../client";
import { AUTH_ENDPOINTS } from "../endpoints";
import { LoginRequest, LoginResponse, User } from "../types";

export const authService = {
  async login(credentials: LoginRequest) {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials,
      );

      if (response?.success && response.data?.authDetails?.accessToken) {
        // Store tokens in localStorage
        localStorage.setItem(
          "accessToken",
          response.data.authDetails.accessToken,
        );

        if (response.data.authDetails.refreshToken) {
          localStorage.setItem(
            "refreshToken",
            response.data.authDetails.refreshToken,
          );
        }

        if (response.data.authDetails.tokenType) {
          localStorage.setItem(
            "tokenType",
            response.data.authDetails.tokenType,
          );
        }

        // Store token expiry
        if (response.data.authDetails.expiresIn) {
          const expiryTime =
            Date.now() + response.data.authDetails.expiresIn * 1000;
          localStorage.setItem("tokenExpiry", expiryTime.toString());
        }

        // Store org ID
        if (response.data.user?.org?.id) {
          localStorage.setItem("orgId", response.data.user.org.id);
        }

        // Store full user details
        if (response.data.user) {
          localStorage.setItem(
            "userDetails",
            JSON.stringify(response.data.user),
          );
        }
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async logout() {
    try {
      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem("refreshToken");

      // Attempt to notify backend with refresh token
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT, {
        refreshToken: refreshToken,
      });
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("userDetails");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("orgId");
    }
  },

  async getCurrentUser() {
    try {
      return await apiClient.get<User>(AUTH_ENDPOINTS.ME);
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.REFRESH,
        { refresh_token: refreshToken },
        { skipAuth: true, retryOn401: false },
      );

      if (!response?.success || !response.data?.authDetails?.accessToken) {
        throw new Error("Token refresh failed");
      }

      localStorage.setItem(
        "accessToken",
        response.data.authDetails.accessToken,
      );

      if (response.data.authDetails.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          response.data.authDetails.refreshToken,
        );
      }

      return response;
    } catch (error) {
      // If refresh fails, clear tokens and force re-login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenType");
      throw error;
    }
  },

  // Helper to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },

  // Helper to get current token
  getToken(): string | null {
    return localStorage.getItem("accessToken");
  },
};
