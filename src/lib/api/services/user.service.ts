import { UserRole } from "@/lib/utils/accessControl";
import { apiClient } from "../client";
import { USER_ENDPOINTS } from "../endpoints";
import {
  UpdateAddressRequest,
  UpdateProfileRequest,
  UserListParams,
  UserListResponse,
  UserProfile,
} from "../types";

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
};
