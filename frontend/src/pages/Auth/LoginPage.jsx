// pages/Auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/layouts/AuthLayout';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use auth context
  const useAuthService = authService(); // Initialize service

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      const response = await useAuthService.login(credentials);
      
      if (response?.user_id && response?.role) {
        // Save user to context and localStorage
        login({
          id: response.user_id,
          role: response.role,
          email: response.email,
          token: response.token // If using JWT
        });
        
        // Redirect to role-specific dashboard
        navigate(`/${response.role}/dashboard`);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.loginPage}>
        <h1>School Portal Login</h1>
        {error && <div className={styles.error}>{error}</div>}
        <LoginForm onSubmit={handleLogin} loading={loading} />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;