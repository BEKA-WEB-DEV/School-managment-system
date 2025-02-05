import apiClient from "./apiClient";

export const paymentService = {
  create: (data) => apiClient.post("/payments", data),
  getByStudent: (studentId) =>
    apiClient.get(`/payments?student_id=${studentId}`),
  generateReceipt: (paymentId) =>
    apiClient.get(`/payments/${paymentId}/receipt`, {
      responseType: "blob",
    }),
};
