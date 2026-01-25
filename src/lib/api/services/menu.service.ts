import { apiClient } from "../client";
import { MENU_ENDPOINTS } from "../endpoints";
import { MenuItem, CreateMenuItemRequest } from "../types";

export const menuService = {
  async getAll() {
    return apiClient.get<MenuItem[]>(MENU_ENDPOINTS.LIST);
  },

  async getCatalog() {
    return apiClient.get<MenuItem[]>(MENU_ENDPOINTS.CATALOG);
  },

  async getById(id: string) {
    return apiClient.get<MenuItem>(MENU_ENDPOINTS.GET(id));
  },

  async create(data: CreateMenuItemRequest) {
    return apiClient.post<MenuItem>(MENU_ENDPOINTS.CREATE, data);
  },

  async update(id: string, data: Partial<CreateMenuItemRequest>) {
    return apiClient.put<MenuItem>(MENU_ENDPOINTS.UPDATE(id), data);
  },

  async delete(id: string) {
    return apiClient.delete(MENU_ENDPOINTS.DELETE(id));
  },
};
