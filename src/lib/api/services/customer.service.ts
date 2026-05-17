import { apiClient } from "../client";
import { CUSTOMER_ENDPOINTS } from "../endpoints";
import { Customer, CreateCustomerRequest, LoyaltyProgram } from "../types";

// Types for Menu API response
export interface ApiMenuItem {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  category: {
    id: string;
    name: string;
  };
  images: Array<{
    url: string;
    type: string;
  }>;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  variants: any[];
  addOns: any[];
  preparationTime?: number;
  allergens?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiOrganisationPayment {
  upiId?: string;
  merchantId?: string;
  merchantName?: string;
  enabledMethods?: string[];
}

export interface ApiOrganisationUIDesign {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  theme?: string;
  menuLayout?: string;
}

export interface ApiOrganisationBusiness {
  taxPercentage?: number;
  taxLabel?: string;
  currency?: string;
  currencySymbol?: string;
  packagingCharge?: number;
  deliveryCharge?: number;
  freeDeliveryAbove?: number;
  minOrderAmount?: number;
  isPremium?: boolean;
}

export interface ApiOrganisationConfigurations {
  uiDesign?: ApiOrganisationUIDesign;
  business?: ApiOrganisationBusiness;
}

export interface ApiOrganisation {
  id: string;
  name: string;
  payment?: ApiOrganisationPayment;
  configurations?: ApiOrganisationConfigurations;
}

export interface ApiContext {
  tableNumber: string | null;
  orderType: string;
  qrString: string;
}

export interface MenuApiResponse {
  success: boolean;
  data: {
    items: ApiMenuItem[];
    organisation: ApiOrganisation;
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
    return apiClient.get<MenuApiResponse>("/v1/public/menu", { qr: qrCode });
  },
};
