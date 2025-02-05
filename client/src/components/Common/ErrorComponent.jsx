// src/components/Common/ErrorComponent.jsx
import React from 'react';
import './ErrorComponent.css';

const ErrorComponent = ({ message }) => {
    return (
        <div className="error-component">
            <p>{message}</p>
        </div>
    );
};

export default ErrorComponent;