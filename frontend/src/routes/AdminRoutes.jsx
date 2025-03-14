// routes/AdminRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AdminDashboardPage from '../pages/Dashboard/AdminDashboardPage';
import UserManagementPage from '../pages/Admin/UserManagementPage';
import SystemConfigPage from '../pages/Admin/SystemConfigPage';
// import MainLayout from '../components/layouts/MainLayout';
import { Navigate } from 'react-router-dom';
import StudentsListPage from '../pages/Registrar/StudentsListPage';
import TeachersListPage from '../pages/Registrar/TeachersListPage';

const AdminRoutes = () => (
  <section role="admin">
    <Routes>
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="users" element={<UserManagementPage />} />
      <Route path="system" element={<SystemConfigPage />} />
      <Route path="students" element={<StudentsListPage />} />
      <Route path="teachers" element={<TeachersListPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </section>
);

export default AdminRoutes;