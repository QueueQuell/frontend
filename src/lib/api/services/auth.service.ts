import { apiClient } from "../client";
import { AUTH_ENDPOINTS } from "../endpoints";
import { LoginRequest, LoginResponse, User } from "../types";

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await apiClient.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    
    if (response && response.success && response.data && response.data.access_token) {
      localStorage.setItem("authToken", response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem("refreshToken", response.data.refresh_token);
      }
    }
    
    return response;
  },

  async logout() {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
    }
  },

  async getCurrentUser() {
    return apiClient.get<User>(AUTH_ENDPOINTS.ME);
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<LoginResponse>(
      AUTH_ENDPOINTS.REFRESH,
      { refreshToken }
    );

    if (response.success && response.data && response.data.access_token) {
      localStorage.setItem("authToken", response.data.access_token);
    }

    return response;
  },
};
