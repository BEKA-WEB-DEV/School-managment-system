// routes/RegistrarRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrarDashboardPage from '../pages/Dashboard/RegistrarDashboardPage';
import StudentsListPage from '../pages/Registrar/StudentsListPage';
import TeachersListPage from '../pages/Registrar/TeachersListPage';
import AddStudentPage from '../pages/Registrar/AddStudentPage';
import AddTeacherPage from '../pages/Registrar/AddTeacherPage';
import MainLayout from '../components/layouts/MainLayout';

const RegistrarRoutes = () => (
  <div role="registrar,admin">
    <Routes>
      <Route path="dashboard" element={<RegistrarDashboardPage />} />
      <Route path="students" element={<StudentsListPage />} />
      <Route path="teachers" element={<TeachersListPage />} />
      <Route path="add-student" element={<AddStudentPage />} />
      <Route path="add-teacher" element={<AddTeacherPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </div>
);

export default RegistrarRoutes;