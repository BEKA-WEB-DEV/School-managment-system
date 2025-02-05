// src/components/Certifications/CertificationList.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import  certificationService  from '../../services/certificationService';

const CertificationList = () => {
    const [certifications, setCertifications] = useState([]);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await certificationService.getAllCertifications();
                setCertifications(response.data);
            } catch (error) {
                console.error('Error fetching certifications:', error);
            }
        };

        fetchCertifications();
    }, []);

    return (
        <div className="certification-list">
            <h2>Certification List</h2>
            <ul>
                {certifications.map(certification => (
                    <li key={certification.id}>
                        <strong>{certification.name}</strong> - {certification.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CertificationList;