"use client";

import { apiClient } from "../client";
import { AUTH_ENDPOINTS } from "../endpoints";
import { LoginRequest, LoginResponse, User } from "../types";

export const authService = {
  async login(credentials: LoginRequest) {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );
      
      if (response?.success && response.data?.access_token) {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", response.data.access_token);
        
        if (response.data.refresh_token) {
          localStorage.setItem("refreshToken", response.data.refresh_token);
        }
        
        if (response.data.token_type) {
          localStorage.setItem("tokenType", response.data.token_type);
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
      // Attempt to notify backend
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenType");
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
        { refresh_token: refreshToken }
      );

      if (response?.success && response.data?.access_token) {
        localStorage.setItem("accessToken", response.data.access_token);
        
        if (response.data.refresh_token) {
          localStorage.setItem("refreshToken", response.data.refresh_token);
        }
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