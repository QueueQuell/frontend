import { apiClient } from "../client";
import { USER_ENDPOINTS } from "../endpoints";
import {
  UserProfile,
  UpdateProfileRequest,
  UpdateAddressRequest,
} from "../types";

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
};
