// src/services/certificationService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const certificationService = {
    getAllCertifications: async () => {
        const response = await axios.get(`${API_URL}/certifications`);
        return response;
    },
    getCertificationById: async (id) => {
        const response = await axios.get(`${API_URL}/certifications/${id}`);
        return response;
    },
    createCertification: async (certification) => {
        const response = await axios.post(`${API_URL}/certifications`, certification);
        return response;
    },
    updateCertification: async (id, certification) => {
        const response = await axios.put(`${API_URL}/certifications/${id}`, certification);
        return response;
    },
};

export default certificationService;