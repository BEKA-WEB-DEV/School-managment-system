// routes/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import AdminRoutes from './AdminRoutes';
import AcademicRoutes from './AcademicRoutes';
import RegistrarRoutes from './RegistrarRoutes';
import TeacherRoutes from './TeacherRoutes';
import StudentRoutes from './StudentRoutes';
import ParentRoutes from './ParentRoutes';
import ProfilePage from '../pages/Profile/ProfilePage';
import { useAuth } from '../hooks/useAuth';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/*" element={<AuthRoutes />} />
        
        {/* Protected role-based routes */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth role="admin">
              <AdminRoutes />
            </RequireAuth>
          }
        />
        
        <Route
          path="/academic/*"
          element={
            <RequireAuth role={['admin', 'academic']}>
              <AcademicRoutes />
            </RequireAuth>
          }
        />
        
        <Route
            path="/registrar/*"
            element={
              <RequireAuth roles={['admin', 'registrar']}>
                <RegistrarRoutes />
              </RequireAuth>
            }
        />
        
        <Route
          path="/teacher/*"
          element={
            <RequireAuth role={['admin', 'teacher']}>
              <TeacherRoutes />
            </RequireAuth>
          }
        />
        
        <Route
          path="/student/*"
          element={
            <RequireAuth role={['admin', 'student']}>
              <StudentRoutes />
            </RequireAuth>
          }
        />
        
        <Route
          path="/parent/*"
          element={
            <RequireAuth role={['admin', 'parent']}>
              <ParentRoutes />
            </RequireAuth>
          }
        />
        
        {/* Default redirect */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/${user.role}/dashboard`} replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />
        
        <Route
          path="/profile"
          element={
                <RequireAuth roles={['admin', 'teacher', 'student', 'parent', 'registrar']}>
              <ProfilePage />
        </RequireAuth>
  }
/>
        {/* 404 handler */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

const RequireAuth = ({ children, roles = [] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Admin has access to everything
  if (user.role === 'admin') {
    return children;
  }

  // Check if user has any of the required roles
  if (!roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default AppRoutes;