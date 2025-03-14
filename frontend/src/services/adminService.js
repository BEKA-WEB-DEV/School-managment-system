import  useApi  from '../hooks/useApi';

export const adminService = () => {
  const api = useApi();

  return {
    // User Management
    getUsers: async () => {
      return api.get('/admin/users');
    },
    createUser: async (userData) => {
      return api.post('/admin/users', userData);
    },

    // System Configuration
    configureAcademicYear: async (yearData) => {
      return api.post('/system/academic', yearData);
    },
    getAcademicYears: async () => {
      return api.get('/system/academic');
    },
  };
};