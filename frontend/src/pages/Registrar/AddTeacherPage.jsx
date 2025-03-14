import { useState } from 'react';
import TeacherForm from '../../components/registrar/TeacherForm';
import { registrarService } from '../../services/registrarService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './AddTeacherPage.module.css';

const AddTeacherPage = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (teacherData) => {
    try {
      const newTeacher = await registrarService().registerTeacher(teacherData);
      setSuccess(`Teacher ${newTeacher.first_name} ${newTeacher.last_name} registered successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to register teacher');
    }
  };

  return (
    <MainLayout role="registrar">
      <div className={styles.registrationPage}>
        <h1>Teacher Registration</h1>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}
        <TeacherForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
};

export default AddTeacherPage;