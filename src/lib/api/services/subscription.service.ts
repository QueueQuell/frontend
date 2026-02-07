import { apiClient } from "../client";
import { Subscription } from "../types";

export const subscriptionService = {
  async getSubscription() {
    return apiClient.get<Subscription>("/api/subscription");
  },

  async getSubscriptionHistory() {
    return apiClient.get<Subscription[]>("/api/subscription/history");
  },
};
