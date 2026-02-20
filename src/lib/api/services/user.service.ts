import { apiClient } from "../client";
import { USER_ENDPOINTS } from "../endpoints";
import {
  UserProfile,
  UpdateProfileRequest,
  UpdateAddressRequest,
} from "../types";

export type UserRole =
  | "USER"
  | "ADMIN"
  | "MANAGER"
  | "SUPER_ADMIN"
  | "DELIVERY_PERSONNEL"
  | "CHEF"
  | "WAITER"
  | "STAFF";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organisationId: string;
  role?: UserRole;
}

export interface RegisterResponse {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    loginProvider: string;
    status: string;
    isActive: boolean;
    organisationId: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AdminUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  loginProvider: string;
  status: string;
  isActive: boolean;
  failedLoginAttempts: number;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}

export const userService = {
  async getProfile() {
    return apiClient.get<UserProfile>(USER_ENDPOINTS.PROFILE);
  },

  async updateProfile(data: UpdateProfileRequest) {
    return apiClient.put<UserProfile>(USER_ENDPOINTS.UPDATE_PROFILE, data);
  },

  async getAddress() {
    return apiClient.get<UserProfile>(USER_ENDPOINTS.ADDRESS);
  },

  async updateAddress(data: UpdateAddressRequest) {
    return apiClient.put<UserProfile>(USER_ENDPOINTS.UPDATE_ADDRESS, data);
  },

  async register(data: RegisterRequest) {
    return apiClient.post<RegisterResponse>(USER_ENDPOINTS.REGISTER, data);
  },

  async getAdminUsers(params?: AdminUserListParams) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.search) queryParams.set("search", params.search);
    if (params?.status) queryParams.set("status", params.status);
    if (params?.role) queryParams.set("role", params.role);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${USER_ENDPOINTS.ADMIN_LIST}?${queryString}`
      : USER_ENDPOINTS.ADMIN_LIST;

    // Use getWithMeta to preserve pagination metadata (total, page, limit)
    const response = await apiClient.getWithMeta<AdminUser[]>(endpoint);

    return {
      success: response.success,
      data: {
        data: response.data || [],
        total: response.meta?.total || response.data?.length || 0,
        page: response.meta?.page || params?.page || 1,
        limit: response.meta?.limit || params?.limit || 10,
      },
      message: response.message,
    };
  },
};
