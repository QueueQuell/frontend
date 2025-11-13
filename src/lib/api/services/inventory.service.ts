import { apiClient } from "../client";
import { INVENTORY_ENDPOINTS } from "../endpoints";
import {
  InventoryItem,
  CreateInventoryRequest,
  StockAdjustmentRequest,
} from "../types";

export const inventoryService = {
  async getAll() {
    return apiClient.get<InventoryItem[]>(INVENTORY_ENDPOINTS.LIST);
  },

  async getById(id: string) {
    return apiClient.get<InventoryItem>(INVENTORY_ENDPOINTS.GET(id));
  },

  async create(data: CreateInventoryRequest) {
    return apiClient.post<InventoryItem>(INVENTORY_ENDPOINTS.CREATE, data);
  },

  async update(id: string, data: Partial<CreateInventoryRequest>) {
    return apiClient.put<InventoryItem>(INVENTORY_ENDPOINTS.UPDATE(id), data);
  },

  async delete(id: string) {
    return apiClient.delete(INVENTORY_ENDPOINTS.DELETE(id));
  },

  async adjustStock(data: StockAdjustmentRequest) {
    return apiClient.post(INVENTORY_ENDPOINTS.ADJUST, data);
  },
};
