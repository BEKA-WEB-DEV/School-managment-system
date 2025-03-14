import { useEffect, useState } from 'react';
import ClassCard from '../../components/academic/ClassCard';
import { academicService } from '../../services/academicService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './ClassManagementPage.module.css';

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await academicService().getClasses();
        setClasses(data);
      } catch (err) {
        setError('Failed to load classes');
      }
    };
    fetchClasses();
  }, []);

  return (
    <MainLayout role="academic">
      <div className={styles.classManagement}>
        <h1>Class Management</h1>
        {error && <Notification message={error} type="error" />}
        
        <div className={styles.grid}>
          {classes.map(cls => (
            <ClassCard
              key={cls.class_id}
              className={cls.class_name}
              schedule={cls.schedule}
              teacher={cls.teacher_name}
              room={cls.room_number}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ClassManagementPage;