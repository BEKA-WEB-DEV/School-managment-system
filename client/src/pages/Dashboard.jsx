// src/pages/Dashboard.jsx
import React from 'react';
import Layout from '../components/Layout/Layout';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import ParentDashboard from '../components/Dashboard/ParentDashboard';
import TeacherDashboard from '../components/Dashboard/TeacherDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { selectedRole } = useAuth();

    let dashboardComponent;

    switch (selectedRole) {
        case 'student':
            dashboardComponent = <StudentDashboard />;
            break;
        case 'parent':
            dashboardComponent = <ParentDashboard />;
            break;
        case 'teacher':
            dashboardComponent = <TeacherDashboard />;
            break;
        case 'admin':
            dashboardComponent = <AdminDashboard />;
            break;
        default:
            dashboardComponent = <div>Invalid role selected</div>;
    }

    return (
        <Layout role={selectedRole}>
            <h2>Welcome, {selectedRole}</h2>
            {dashboardComponent}
        </Layout>
    );
};

export default Dashboard;