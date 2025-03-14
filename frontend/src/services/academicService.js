import useApi  from '../hooks/useApi';

export const academicService = () => {
  const api = useApi();

  return {
    // Class Management
    createClass: async (classData) => {
      return api.post('/academic/classes', classData);
    },
    getClasses: async () => {
      return api.get('/academic/classes');
    },

    // Exam Management
    scheduleExam: async (examData) => {
      return api.post('/academic/exams', examData);
    },
    getExams: async () => {
      return api.get('/academic/exams');
    },
  };
};