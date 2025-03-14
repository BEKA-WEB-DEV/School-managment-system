import useApi  from '../hooks/useApi';

export const parentService = () => {
  const api = useApi();

  return {
    // Payments
    makePayment: async (paymentData) => {
      return api.post('/parent/payments', paymentData);
    },
    getPaymentHistory: async () => {
      return api.get('/parent/payments');
    },

    // Children Management
    getChildren: async () => {
      return api.get('/parent/children');
    },
    getChildDetails: async (childId) => {
      return api.get(`/parent/children/${childId}`);
    },
  };
};