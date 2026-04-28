import { apiClient } from "../client";
import { MENU_ENDPOINTS } from "../endpoints";
import { MenuItemType, CreateMenuItemRequest } from "../types";

export const menuService = {
  async getAll() {
    return apiClient.get<MenuItemType[]>(MENU_ENDPOINTS.LIST);
  },

  async getCatalog() {
    return apiClient.get<MenuItemType[]>(MENU_ENDPOINTS.CATALOG);
  },

  async getById(id: string) {
    return apiClient.get<MenuItemType>(MENU_ENDPOINTS.GET(id));
  },

  async create(data: CreateMenuItemRequest) {
    return apiClient.post<MenuItemType>(MENU_ENDPOINTS.CREATE, data);
  },

  async update(id: string, data: Partial<CreateMenuItemRequest>) {
    return apiClient.put<MenuItemType>(MENU_ENDPOINTS.UPDATE(id), data);
  },

  async delete(id: string) {
    return apiClient.delete(MENU_ENDPOINTS.DELETE(id));
  },
};
