import { apiClient } from "../client";
import { QR_ENDPOINTS } from "../endpoints";
import { QRCode, GenerateQRRequest, Table } from "../types";

export const qrService = {
  async generate(data: GenerateQRRequest) {
    return apiClient.post<QRCode>(QR_ENDPOINTS.GENERATE, data);
  },

  async getAll() {
    return apiClient.get<QRCode[]>(QR_ENDPOINTS.LIST);
  },

  async getById(id: string) {
    return apiClient.get<QRCode>(QR_ENDPOINTS.GET(id));
  },

  async delete(id: string) {
    return apiClient.delete(QR_ENDPOINTS.DELETE(id));
  },

  async getTables() {
    return apiClient.get<Table[]>(QR_ENDPOINTS.TABLES);
  },

  async getMenus() {
    return apiClient.get<QRCode[]>(QR_ENDPOINTS.MENUS);
  },
};
