// src/components/Certifications/CertificationDetails.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import  certificationService  from '../../services/certificationService';

const CertificationDetails = () => {
    const { id } = useParams();
    const [certification, setCertification] = useState(null);

    useEffect(() => {
        const fetchCertification = async () => {
            try {
                const response = await certificationService.getCertificationById(id);
                setCertification(response.data);
            } catch (error) {
                console.error('Error fetching certification:', error);
            }
        };

        fetchCertification();
    }, [id]);

    if (!certification) {
        return <div>Loading...</div>;
    }

    return (
        <div className="certification-details">
            <h2>Certification Details</h2>
            <p><strong>Name:</strong> {certification.name}</p>
            <p><strong>Description:</strong> {certification.description}</p>
        </div>
    );
};

export default CertificationDetails;