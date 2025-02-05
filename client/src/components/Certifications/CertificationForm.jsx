// src/components/Certifications/CertificationForm.jsx
import React, { useState } from 'react';
import  certificationService  from '../../services/certificationService';

const CertificationForm = ({ initialData, onSubmit }) => {
    const [name, setName] = useState(initialData ? initialData.name : '');
    const [description, setDescription] = useState(initialData ? initialData.description : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const certification = { name, description };
        if (initialData) {
            await certificationService.updateCertification(initialData.id, certification);
        } else {
            await certificationService.createCertification(certification);
        }
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{initialData ? 'Edit' : 'Create'} Certification</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">{initialData ? 'Update' : 'Create'}</button>
        </form>
    );
};

export default CertificationForm;