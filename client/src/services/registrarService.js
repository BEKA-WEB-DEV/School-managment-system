// src/services/registrarService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const registrarService = {
    addNewStudent: async (studentData) => {
        const response = await axios.post(`${API_URL}/students`, studentData);
        return response;
    },
    addNewTeacher: async (teacherData) => {
        const response = await axios.post(`${API_URL}/teachers`, teacherData);
        return response;
    },
};

export default registrarService;