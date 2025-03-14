// routes/StudentRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import StudentDashboardPage from '../pages/Dashboard/StudentDashboardPage';
import SchedulePage from '../pages/Student/SchedulePage';
import GradesPage from '../pages/Student/GradesPage';
import CertificationsPage from '../pages/Student/CertificationsPage';
import MainLayout from '../components/layouts/MainLayout';
import { Navigate } from 'react-router-dom';

const StudentRoutes = () => (
  <section role="student">
    <Routes>
      <Route path="dashboard" element={<StudentDashboardPage />} />
      <Route path="schedule" element={<SchedulePage />} />
      <Route path="grades" element={<GradesPage />} />
      <Route path="certifications" element={<CertificationsPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </section>
);

export default StudentRoutes;