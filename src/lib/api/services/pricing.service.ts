import { apiClient } from "../client";
import { PricingBook, TaxProfile, Surcharge } from "../types";

export const pricingService = {
  // Pricing Books
  async getPricingBooks() {
    return apiClient.get<PricingBook[]>("/api/pricing/books");
  },

  async createPricingBook(data: any) {
    return apiClient.post<PricingBook>("/api/pricing/books", data);
  },

  async updatePricingBook(data: PricingBook) {
    return apiClient.put<PricingBook>("/api/pricing/books", data);
  },

  async deletePricingBook(id: string) {
    return apiClient.delete(`/api/pricing/books?id=${id}`);
  },

  // Tax Profiles
  async getTaxProfiles() {
    return apiClient.get<TaxProfile[]>("/api/tax/profiles");
  },

  async createTaxProfile(data: any) {
    return apiClient.post<TaxProfile>("/api/tax/profiles", data);
  },

  async updateTaxProfile(data: TaxProfile) {
    return apiClient.put<TaxProfile>("/api/tax/profiles", data);
  },

  async deleteTaxProfile(id: string) {
    return apiClient.delete(`/api/tax/profiles?id=${id}`);
  },

  // HSN Codes
  async getHsnCodes() {
    return apiClient.get<any[]>("/api/tax/hsn");
  },

  async createHsnCode(data: any) {
    return apiClient.post<any>("/api/tax/hsn", data);
  },

  async updateHsnCode(data: any) {
    return apiClient.put<any>("/api/tax/hsn", data);
  },

  async deleteHsnCode(id: string) {
    return apiClient.delete(`/api/tax/hsn?id=${id}`);
  },

  // Surcharges
  async getSurcharges() {
    return apiClient.get<Surcharge[]>("/api/pricing/surcharges");
  },

  async createSurcharge(data: any) {
    return apiClient.post<Surcharge>("/api/pricing/surcharges", data);
  },

  async updateSurcharge(data: Surcharge) {
    return apiClient.put<Surcharge>("/api/pricing/surcharges", data);
  },

  async deleteSurcharge(id: string) {
    return apiClient.delete(`/api/pricing/surcharges?id=${id}`);
  },
};
