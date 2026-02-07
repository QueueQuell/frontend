import { apiClient } from "../client";
import { User, OrgOut, OrgCreate, StoreOut, StoreCreate, UserCreate } from "../types";

export const adminService = {
  // Users
  async getUsers() {
    return apiClient.get<User[]>("/admin/users");
  },

  async createUser(data: UserCreate) {
    return apiClient.post<User>("/admin/users", data);
  },

  async updateUser(data: User) {
    return apiClient.put<User>("/admin/users", data);
  },

  async deleteUser(id: string) {
    return apiClient.delete(`/admin/users?id=${id}`);
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
