import { useState } from 'react';
import ExamSubmitForm from '../../components/teacher/ExamSubmitForm';
import { teacherService } from '../../services/teacherService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './ExamPage.module.css';

const ExamPage = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (examData) => {
    try {
      await teacherService().createExam(examData);
      setSuccess('Exam created successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create exam');
    }
  };

  return (
    <MainLayout role="teacher">
      <div className={styles.examPage}>
        <h1>Exam Management</h1>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}
        <ExamSubmitForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
};

export default ExamPage;