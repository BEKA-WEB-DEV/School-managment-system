// src/services/parentService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const parentService = {
    getChildren: async () => {
        const response = await axios.get(`${API_URL}/parents/children`);
        return response;
    },
    getExamResultsForChildren: async (childrenIds) => {
        const response = await axios.post(`${API_URL}/exam/results`, { childrenIds });
        return response;
    },
};

export default parentService;