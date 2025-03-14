// services/authService.js
import useApi  from '../hooks/useApi';

export const authService = () => {
  const api = useApi();

  return {
    login: async (credentials) => {
      return api.post('/auth/login', credentials);
    },
    logout: async () => {
      return api.post('/auth/logout');
    },
    refreshToken: async () => {
      return api.post('/auth/refresh');
    }
  };
};
// export const authService = () => {
//   const api = useApi();

//   return {
//     login: async (credentials) => {
//       return api.post('/auth/login', {
//         email: credentials.email,
//         password: credentials.password
//       });
//     },

//     logout: async () => {
//       return api.post('/auth/logout');
//     }

//   };
// };