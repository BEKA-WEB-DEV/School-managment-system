// routes/AuthRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
// import LogoutPage from '../pages/Auth/LogoutPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import InstallationPage from '../pages/System/InstallationPage';
import AuthLayout from '../components/layouts/AuthLayout';
import { Navigate } from 'react-router-dom';

const AuthRoutes = () => (
  <AuthLayout>
    <Routes>
      <Route path="login" element={<LoginPage />} />
      {/* <Route path="logout" element={<LogoutPage />} /> */}
      <Route path="register" element={<RegisterPage />} />
      <Route path="install" element={<InstallationPage />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  </AuthLayout>
);

export default AuthRoutes;