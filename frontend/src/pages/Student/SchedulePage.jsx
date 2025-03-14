import { useEffect, useState } from 'react';
import ScheduleCard from '../../components/student/ScheduleCard';
import { studentService } from '../../services/studentService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './SchedulePage.module.css';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await studentService().getSchedule();
        setSchedule(data);
      } catch (err) {
        setError('Failed to load schedule');
      }
    };
    fetchSchedule();
  }, []);

  return (
    <MainLayout role="student">
      <div className={styles.schedulePage}>
        <h1>My Class Schedule</h1>
        {error && <Notification message={error} type="error" />}
        <div className={styles.scheduleGrid}>
          {schedule.map((cls) => (
            <ScheduleCard
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

export default SchedulePage;