// routes/TeacherRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import TeacherDashboardPage from '../pages/Dashboard/TeacherDashboardPage';
import AttendancePage from '../pages/Teacher/AttendancePage';
import ExamPage from '../pages/Teacher/ExamPage';
import MainLayout from '../components/layouts/MainLayout';
import { Navigate } from 'react-router-dom';

const TeacherRoutes = () => (
  <section role="teacher">
    <Routes>
      <Route path="dashboard" element={<TeacherDashboardPage />} />
      <Route path="attendance" element={<AttendancePage />} />
      <Route path="exams" element={<ExamPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </section>
);

export default TeacherRoutes;