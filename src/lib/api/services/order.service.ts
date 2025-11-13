import { apiClient } from "../client";
import { ORDER_ENDPOINTS } from "../endpoints";
import { Order, CreateOrderRequest } from "../types";

export const orderService = {
  async getAll() {
    return apiClient.get<Order[]>(ORDER_ENDPOINTS.LIST);
  },

  async getById(id: string) {
    return apiClient.get<Order>(ORDER_ENDPOINTS.GET(id));
  },

  async create(data: CreateOrderRequest) {
    return apiClient.post<Order>(ORDER_ENDPOINTS.CREATE, data);
  },

  async update(id: string, data: Partial<CreateOrderRequest>) {
    return apiClient.put<Order>(ORDER_ENDPOINTS.UPDATE(id), data);
  },

  async delete(id: string) {
    return apiClient.delete(ORDER_ENDPOINTS.DELETE(id));
  },

  async updateStatus(id: string, status: string) {
    return apiClient.patch<Order>(ORDER_ENDPOINTS.UPDATE_STATUS(id), {
      status,
    });
  },
};
