"use client";

import { apiClient } from "../client";
import { CATEGORY_ENDPOINTS } from "../endpoints";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types";

export const categoryService = {
  async getAll() {
    try {
      const response = await apiClient.get<Category[]>(CATEGORY_ENDPOINTS.LIST);
      return response;
    } catch (error) {
      console.error("Get all categories error:", error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await apiClient.get<Category>(
        CATEGORY_ENDPOINTS.GET(id),
      );
      return response;
    } catch (error) {
      console.error("Get category by ID error:", error);
      throw error;
    }
  },

  async create(data: CreateCategoryRequest) {
    try {
      const response = await apiClient.post<Category>(
        CATEGORY_ENDPOINTS.CREATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Create category error:", error);
      throw error;
    }
  },

  async update(id: string, data: UpdateCategoryRequest) {
    try {
      const response = await apiClient.put<Category>(
        CATEGORY_ENDPOINTS.UPDATE(id),
        data,
      );
      return response;
    } catch (error) {
      console.error("Update category error:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const response = await apiClient.delete(CATEGORY_ENDPOINTS.DELETE(id));
      return response;
    } catch (error) {
      console.error("Delete category error:", error);
      throw error;
    }
  },
};
