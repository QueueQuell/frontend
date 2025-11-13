import { apiClient } from "../client";
import { SUPPLIER_ENDPOINTS } from "../endpoints";
import { Supplier, CreateSupplierRequest } from "../types";

export const supplierService = {
  async getAll() {
    return apiClient.get<Supplier[]>(SUPPLIER_ENDPOINTS.LIST);
  },

  async getById(id: string) {
    return apiClient.get<Supplier>(SUPPLIER_ENDPOINTS.GET(id));
  },

  async create(data: CreateSupplierRequest) {
    return apiClient.post<Supplier>(SUPPLIER_ENDPOINTS.CREATE, data);
  },

  async update(id: string, data: Partial<CreateSupplierRequest>) {
    return apiClient.put<Supplier>(SUPPLIER_ENDPOINTS.UPDATE(id), data);
  },

  async delete(id: string) {
    return apiClient.delete(SUPPLIER_ENDPOINTS.DELETE(id));
  },

  async getPerformance() {
    return apiClient.get<Supplier[]>(SUPPLIER_ENDPOINTS.PERFORMANCE);
  },

  async getProcurement() {
    return apiClient.get(SUPPLIER_ENDPOINTS.PROCUREMENT);
  },
};
