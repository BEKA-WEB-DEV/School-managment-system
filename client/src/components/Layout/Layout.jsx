// src/components/Layout/Layout.jsx
import React from 'react';
import Sidebar from '../Common/Sidebar';
import './Layout.css';

const Layout = ({ children, role }) => {
    return (
        <div className="layout">
            <Sidebar role={role} />
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;