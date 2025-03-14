// services/userService.js
import useApi from '../hooks/useApi';

export const userService = () => {
  const api = useApi();

  return {
    getNotifications: async (userId) => {
      return api.get(`/users/${userId}/notifications`);
    },
    updateProfile: async (userId, data) => {
      return api.patch(`/admin/users/${userId}`, data);
    },
    
    getUserProfile: async (userId) => {
      try {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
      } catch (err) {
        throw new Error(err.response?.data?.error || 'Failed to fetch profile');
      }
    },
    updateUserProfile: async (userId, profileData) => {
      return api.put(`/admin/users/${userId}`, profileData);
    },
    updatePassword: async (userId, passwordData) => {
      return api.patch(`admin/users/${userId}/password`, passwordData);
    },
    getAllUsers: async () => {
      return api.get('/admin/users');
    },
    deleteUser: async (userId) => {
      return api.delete(`/admin/users/${userId}`);
    }
  };
};