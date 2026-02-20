"use client";

import { apiClient } from "../client";
import { ORGANISATION_ENDPOINTS } from "../endpoints";
import { Organisation, OrganisationListResponse } from "../types";

export const organisationService = {
  async getOrganisations() {
    return apiClient.get<OrganisationListResponse>(ORGANISATION_ENDPOINTS.LIST);
  },

  async getOrganisation(id: string) {
    return apiClient.get<Organisation>(ORGANISATION_ENDPOINTS.GET(id));
  },

  async createOrganisation(data: Partial<Organisation>) {
    const response = await apiClient.post<Organisation>(
      ORGANISATION_ENDPOINTS.CREATE,
      data,
    );
    return response;
  },

  async updateOrganisation(id: string, data: Partial<Organisation>) {
    return apiClient.put<Organisation>(ORGANISATION_ENDPOINTS.UPDATE(id), data);
  },

  async deleteOrganisation(id: string) {
    return apiClient.delete(ORGANISATION_ENDPOINTS.DELETE(id));
  },
};
