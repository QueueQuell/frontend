import { apiClient } from "../client";
import { PAYMENT_ENDPOINTS } from "../endpoints";
import { Payment, PaymentMethod, CreatePaymentRequest } from "../types";

export const paymentService = {
  async getAll() {
    return apiClient.get<Payment[]>(PAYMENT_ENDPOINTS.LIST);
  },

  async getById(id: string) {
    return apiClient.get<Payment>(PAYMENT_ENDPOINTS.GET(id));
  },

  async create(data: CreatePaymentRequest) {
    return apiClient.post<Payment>(PAYMENT_ENDPOINTS.CREATE, data);
  },

  async getHistory() {
    return apiClient.get<Payment[]>(PAYMENT_ENDPOINTS.HISTORY);
  },

  async getMethods() {
    return apiClient.get<PaymentMethod[]>(PAYMENT_ENDPOINTS.METHODS);
  },

  async updateMethod(id: string, enabled: boolean) {
    return apiClient.patch(PAYMENT_ENDPOINTS.UPDATE_METHOD(id), { enabled });
  },

  async getReconciliation() {
    return apiClient.get(PAYMENT_ENDPOINTS.RECONCILIATION);
  },
};
