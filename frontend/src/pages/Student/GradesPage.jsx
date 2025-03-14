import { useEffect, useState } from 'react';
import GradeList from '../../components/student/GradeList';
import { studentService } from '../../services/studentService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './GradesPage.module.css';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await studentService().getGrades();
        setGrades(data);
      } catch (err) {
        setError('Failed to load grades');
      }
    };
    fetchGrades();
  }, []);

  return (
    <MainLayout role="student">
      <div className={styles.gradesPage}>
        <h1>My Grades</h1>
        {error && <Notification message={error} type="error" />}
        <GradeList grades={grades} />
      </div>
    </MainLayout>
  );
};

export default GradesPage;