// src/components/Common/Notification.jsx
import React from 'react';
import './Notification.css';

const Notification = ({ type, message }) => {
    const notificationClass = `notification ${type}`;

    return (
        <div className={notificationClass}>
            {message}
        </div>
    );
};

export default Notification;