// routes/ParentRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import ParentDashboardPage from '../pages/Dashboard/ParentDashboardPage';
import PaymentPage from '../pages/Parent/PaymentPage';
import ChildrenPage from '../pages/Parent/ChildrenPage';
// import MainLayout from '../components/layouts/MainLayout';
import { Navigate } from 'react-router-dom';

const ParentRoutes = () => (
  <section role="parent">
    <Routes>
      <Route path="dashboard" element={<ParentDashboardPage />} />
      <Route path="payments" element={<PaymentPage />} />
      <Route path="children" element={<ChildrenPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </section>
);

export default ParentRoutes;