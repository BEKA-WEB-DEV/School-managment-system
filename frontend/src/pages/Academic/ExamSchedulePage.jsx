import { useState } from 'react';
import ExamForm from '../../components/academic/ExamForm';
import { academicService } from '../../services/academicService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './ExamSchedulePage.module.css';

const ExamSchedulePage = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleScheduleExam = async (examData) => {
    try {
      await academicService().scheduleExam(examData);
      setSuccess('Exam scheduled successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to schedule exam');
    }
  };

  return (
    <MainLayout role="academic">
      <div className={styles.examSchedule}>
        <h1>Exam Scheduling</h1>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}
        
        <ExamForm onSubmit={handleScheduleExam} />
      </div>
    </MainLayout>
  );
};

export default ExamSchedulePage;