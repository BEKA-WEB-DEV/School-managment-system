import apiClient from "./apiClient";

export const studentService = {
  getAll: (params) => apiClient.get("/students", { params }),
  create: (data) => apiClient.post("/students", data),
  getById: (id) => apiClient.get(`/students/${id}`),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  delete: (id) => apiClient.delete(`/students/${id}`),
};
