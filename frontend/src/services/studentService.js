import  useApi  from '../hooks/useApi';

export const studentService = () => {
  const api = useApi();

  return {
    // Schedule
    getSchedule: async () => {
      return api.get('/student/schedule');
    },

    // Results
    getResults: async () => {
      return api.get('/student/results');
    },

    // Certifications
    getCertifications: async () => {
      return api.get('/student/certifications');
    },
    downloadCertification: async (certificationId) => {
      return api.get(`/student/certifications/${certificationId}/download`);
    },
  };
};