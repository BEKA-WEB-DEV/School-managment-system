// src/services/teacherService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const teacherService = {
    // Fetch teacher statistics such as total students, exams, graduate students, etc.
    getTeacherStats: async () => {
        const response = await axios.get(`${API_URL}/teachers/stats`);
        return response;
    },

    // Fetch the list of students assigned to the teacher
    getAssignedStudents: async () => {
        const response = await axios.get(`${API_URL}/teachers/students`);
        return response;
    },

    // Fetch notifications related to the teacher
    getNotifications: async () => {
        const response = await axios.get(`${API_URL}/teachers/notifications`);
        return response;
    },

    // Add any other necessary functions here, e.g., for managing classes, subjects, etc.
};

export default teacherService;