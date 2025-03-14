//components/auth/LoginForm.jsx
import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ 
        email: email.trim().toLowerCase(),
        password: password.trim()
      });
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGroup}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          required
        />
        {formErrors.email && (
          <span className={styles.error}>{formErrors.email}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password}
          required
        />
        {formErrors.password && (
          <span className={styles.error}>{formErrors.password}</span>
        )}
      </div>

      {error && <div className={styles.formError}>{error}</div>}

      <Button 
        type="submit" 
        disabled={loading}
        className={styles.submitButton}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;