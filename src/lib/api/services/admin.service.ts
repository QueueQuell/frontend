import { apiClient } from "../client";
import { ADMIN_USER_ENDPOINTS } from "../endpoints";
import {
  User,
  UserListResponse,
  OrgOut,
  OrgCreate,
  StoreOut,
  StoreCreate,
  UserCreate,
  UserListParams,
} from "../types";

export const adminService = {
  // Users (migrated to v1 specs)
  async listUsers(params: UserListParams): Promise<UserListResponse> {
    const query = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status }),
      ...(params.role && { role: params.role }),
    });
    const response = await apiClient.getPaginated<User>(
      ADMIN_USER_ENDPOINTS.LIST,
      params,
    );

    return response;
  },

  async getUser(id: string) {
    return apiClient.get<User>(ADMIN_USER_ENDPOINTS.DETAIL(id));
  },

  async createUser(data: UserCreate) {
    return apiClient.post<User>(ADMIN_USER_ENDPOINTS.CREATE, data);
  },

  async updateUser(id: string, data: Partial<User>) {
    return apiClient.put<User>(ADMIN_USER_ENDPOINTS.UPDATE(id), data);
  },

  async deleteUser(id: string) {
    return apiClient.delete(ADMIN_USER_ENDPOINTS.DELETE(id));
  },

  // Organizations
  async getOrgs() {
    return apiClient.get<OrgOut[]>("/admin/orgs");
  },

  async createOrg(data: OrgCreate) {
    return apiClient.post<OrgOut>("/admin/orgs", data);
  },

  async updateOrg(data: OrgOut) {
    return apiClient.put<OrgOut>("/admin/orgs", data);
  },

  async deleteOrg(id: string) {
    return apiClient.delete(`/admin/orgs?id=${id}`);
  },

  // Stores
  async getStores() {
    return apiClient.get<StoreOut[]>("/admin/stores");
  },

  async createStore(data: StoreCreate) {
    return apiClient.post<StoreOut>("/admin/stores", data);
  },

  async updateStore(data: StoreOut) {
    return apiClient.put<StoreOut>("/admin/stores", data);
  },

  async deleteStore(id: string) {
    return apiClient.delete(`/admin/stores?id=${id}`);
  },
};
