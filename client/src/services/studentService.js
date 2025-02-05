// src/services/studentService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const studentService = {
    getStudentById: async (id) => {
        const response = await axios.get(`${API_URL}/students/${id}`);
        return response;
    },
    getExamResultsByStudentId: async (id) => {
        const response = await axios.get(`${API_URL}/students/${id}/exam-results`);
        return response;
    },
};

export default studentService;



// // src/services/studentService.js
// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/v1';

// const studentService = {
//     getStudentById: async (id) => {
//         const response = await axios.get(`${API_URL}/students/${id}`);
//         return response;
//     },
//     getParentChildren: async () => {
//         const response = await axios.get(`${API_URL}/parents/children`);
//         return response;
//     },
//     getExamResultsForChildren: async (childrenIds) => {
//         const response = await axios.post(`${API_URL}/exam/results`, { childrenIds });
//         return response;
//     },
//     getExamResultsByStudentId: async (id) => {
//         const response = await axios.get(`${API_URL}/students/${id}/exam-results`);
//         return response;
//     },
// };

// export default studentService;