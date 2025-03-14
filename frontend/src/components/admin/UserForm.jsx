import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './UserForm.module.css';

const validRoles = [
  'admin',
  'academic',
  'registrar',
  'teacher',
  'student',
  'parent'
];

const UserForm = ({ onSubmit, initialData = {}, loading = false }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'student'
  });
  const [errors, setErrors] = useState({});

  // Fix: Use deep comparison for initialData
  useEffect(() => {
    const newData = {
      first_name: initialData.first_name || '',
      last_name: initialData.last_name || '',
      email: initialData.email || '',
      role: initialData.role || 'student'
    };

    // Only update if data has actually changed
    if (JSON.stringify(newData) !== JSON.stringify(formData)) {
      setFormData(newData);
    }
  }, [initialData.first_name, initialData.last_name, initialData.email, initialData.role]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!validRoles.includes(formData.role)) {
      newErrors.role = 'Invalid role selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        email: formData.email.toLowerCase().trim()
      });
    }
  };

  return (
    <form className={styles.userForm} onSubmit={handleSubmit} noValidate>
      <Input
        placeholder="First Name"
        value={formData.first_name}
        onChange={(e) => {
          setFormData({ ...formData, first_name: e.target.value });
          setErrors({ ...errors, first_name: '' });
        }}
        error={errors.first_name}
        required
      />

      <Input
        placeholder="Last Name"
        value={formData.last_name}
        onChange={(e) => {
          setFormData({ ...formData, last_name: e.target.value });
          setErrors({ ...errors, last_name: '' });
        }}
        error={errors.last_name}
        required
      />

      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          setErrors({ ...errors, email: '' });
        }}
        error={errors.email}
        required
      />

      <div className={styles.formGroup}>
        <label>Role</label>
        <select
          value={formData.role}
          onChange={(e) => {
            setFormData({ ...formData, role: e.target.value });
            setErrors({ ...errors, role: '' });
          }}
          className={styles.roleSelect}
          disabled={loading}
        >
          {validRoles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        {errors.role && <span className={styles.error}>{errors.role}</span>}
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className={styles.submitButton}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};

export default UserForm;