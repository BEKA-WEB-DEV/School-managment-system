// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

const authService = {
  login: async (userType, identifier, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      userType,
      identifier,
      password,
    });
    return response.data;
  },
};

export default authService;
