import { apiClient } from "../client";
import { QR_ENDPOINTS } from "../endpoints";
import {
  QRCode,
  GenerateQRRequest,
  Table,
  AdminQRGenerateRequest,
  AdminQRGenerateResponse,
  AdminQRListResponse,
  AdminQRListItem,
} from "../types";

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

  // Deactivate QR
  async deactivate(id: string) {
    return apiClient.patch<AdminQRListItem>(QR_ENDPOINTS.DEACTIVATE(id));
  },

  // Reactivate QR
  async reactivate(id: string) {
    return apiClient.patch<AdminQRListItem>(QR_ENDPOINTS.REACTIVATE(id));
  },

  // Admin QR Generate
  async generateAdminQR(data: AdminQRGenerateRequest) {
    return apiClient.post<AdminQRGenerateResponse>(QR_ENDPOINTS.GENERATE, data);
  },

  // Admin QR List
  async getAllAdminQR() {
    return apiClient.get<AdminQRListResponse>(QR_ENDPOINTS.LIST);
  },
};
