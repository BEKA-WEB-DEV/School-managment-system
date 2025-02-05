import apiClient from "./apiClient";

export const examService = {
  schedule: (data) => apiClient.post("/exams", data),
  getAll: () => apiClient.get("/exams"),
  getResults: (examId) => apiClient.get(`/exams/${examId}/results`),
  publishResults: (examId) => apiClient.post(`/exams/${examId}/publish`),
};
