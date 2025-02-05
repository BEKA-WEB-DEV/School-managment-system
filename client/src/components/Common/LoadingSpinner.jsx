import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner">
            <ScaleLoader
                color="#ffa100"
                height={35}
                speedMultiplier={1}
/>
            </div>
        </div>
    );
};

export default LoadingSpinner;
