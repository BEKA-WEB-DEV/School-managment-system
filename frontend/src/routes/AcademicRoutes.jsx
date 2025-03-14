// routes/AcademicRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AcademicDashboardPage from '../pages/Dashboard/AcademicDashboardPage';
import ClassManagementPage from '../pages/Academic/ClassManagementPage';
import ExamSchedulePage from '../pages/Academic/ExamSchedulePage';
// import MainLayout from '../components/layouts/MainLayout';
import { Navigate } from 'react-router-dom';

const AcademicRoutes = () => (
  <section role="academic">
    <Routes>
      <Route path="dashboard" element={<AcademicDashboardPage />} />
      <Route path="classes" element={<ClassManagementPage />} />
      <Route path="exams" element={<ExamSchedulePage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </section>
);

export default AcademicRoutes;