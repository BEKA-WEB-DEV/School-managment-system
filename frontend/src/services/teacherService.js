import  useApi  from '../hooks/useApi';

export const teacherService = () => {
  const api = useApi();

  return {
    // Attendance
    recordAttendance: async (attendanceData) => {
      return api.post('/teacher/attendance', attendanceData);
    },
    getAttendanceRecords: async (classId) => {
      return api.get(`/teacher/attendance?classId=${classId}`);
    },

    // Exams
    createExam: async (examData) => {
      return api.post('/teacher/exams', examData);
    },
    getExams: async () => {
      return api.get('/teacher/exams');
    },
  };
};