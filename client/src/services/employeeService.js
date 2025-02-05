import apiClient from "./apiClient";

export const employeeService = {
  getAll: () => apiClient.get("/employees"),
  create: (data) => apiClient.post("/employees", data),
  getById: (id) => apiClient.get(`/employees/${id}`),
  updateRole: (id, role) => apiClient.patch(`/employees/${id}/role`, { role }),
};
