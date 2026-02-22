import { apiClient } from "../client";
import { CUSTOMER_ENDPOINTS } from "../endpoints";
import { Customer, CreateCustomerRequest, LoyaltyProgram } from "../types";

// Types for Menu API response
export interface ApiMenuItem {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  category: string;
  categoryId?: string | null;
  type?: string;
  spicinessLevel?: string;
  dietaryTags?: string[];
  pricingModel?: string;
  basePrice: number;
  active: boolean;
  currency?: string;
  status?: string;
  isRecommended?: boolean;
  isPopular?: boolean;
  imageUrl?: string;
  restaurantId?: string;
  nonVeg?: boolean;
  variantGroups?: any[];
  addonGroups?: any[];
  components?: any[];
}

export interface ApiOrganisation {
  id: string;
  name: string;
}

export interface ApiContext {
  tableNumber: string | null;
  orderType: string;
  qrString: string;
}

export interface MenuApiResponse {
  success: boolean;
  data: {
    organisation: ApiOrganisation;
    context: ApiContext;
    menuItems: ApiMenuItem[];
  };
}

export const customerService = {
  async getAll() {
    return apiClient.get<Customer[]>(CUSTOMER_ENDPOINTS.LIST);
  },

  async getById(id: string) {
    return apiClient.get<Customer>(CUSTOMER_ENDPOINTS.GET(id));
  },

  async create(data: CreateCustomerRequest) {
    return apiClient.post<Customer>(CUSTOMER_ENDPOINTS.CREATE, data);
  },

  async update(id: string, data: Partial<CreateCustomerRequest>) {
    return apiClient.put<Customer>(CUSTOMER_ENDPOINTS.UPDATE(id), data);
  },

  async delete(id: string) {
    return apiClient.delete(CUSTOMER_ENDPOINTS.DELETE(id));
  },

  async getLoyaltyPrograms() {
    return apiClient.get<LoyaltyProgram[]>(CUSTOMER_ENDPOINTS.LOYALTY);
  },

  async updateLoyaltyPoints(id: string, points: number) {
    return apiClient.patch(CUSTOMER_ENDPOINTS.LOYALTY_POINTS(id), { points });
  },

  async getMenuByQr(qrCode: string) {
    return apiClient.get<MenuApiResponse>("/customer/menu", { qr: qrCode });
  },
};
