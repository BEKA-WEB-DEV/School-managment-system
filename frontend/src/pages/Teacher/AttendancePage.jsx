import { useEffect, useState } from 'react';
import AttendanceForm from '../../components/teacher/AttendanceForm';
import { academicService } from '../../services/academicService';
import { teacherService } from '../../services/teacherService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './AttendancePage.module.css';

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await academicService().getClassesForTeacher();
        setClasses(data);
      } catch (err) {
        setError('Failed to load classes');
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (attendanceData) => {
    try {
      await teacherService().recordAttendance(attendanceData);
      setSuccess('Attendance recorded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to record attendance');
    }
  };

  return (
    <MainLayout role="teacher">
      <div className={styles.attendancePage}>
        <h1>Class Attendance</h1>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}
        
        {classes.length > 0 ? (
          <AttendanceForm 
            classes={classes} 
            onSubmit={handleSubmit} 
          />
        ) : (
          <p>No classes assigned</p>
        )}
      </div>
    </MainLayout>
  );
};

export default AttendancePage;