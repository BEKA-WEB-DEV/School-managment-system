import apiClient from "./apiClient";

export const parentService = {
  linkStudent: (parentId, studentId) =>
    apiClient.post(`/parents/${parentId}/students/${studentId}`),
  getChildren: (parentId) => apiClient.get(`/parents/${parentId}/students`),
  updateContact: (parentId, data) =>
    apiClient.put(`/parents/${parentId}/contact`, data),
};
