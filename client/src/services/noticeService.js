import apiClient from "./apiClient";

export const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get("/notifications");
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },
};
