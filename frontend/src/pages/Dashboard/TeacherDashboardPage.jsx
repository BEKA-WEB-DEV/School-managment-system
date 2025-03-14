import { useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import { teacherService } from '../../services/teacherService';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './TeacherDashboardPage.module.css';

const TeacherDashboardPage = () => {
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    attendance: '0%'
  });

  useEffect(() => {
    const fetchData = async () => {
      const classes = await teacherService().getClasses();
      setStats({
        classes: classes.length,
        students: classes.reduce((acc, cls) => acc + cls.student_count, 0),
        attendance: '95%' // Example value
      });
    };
    fetchData();
  }, []);

  return (
    <MainLayout role="teacher">
      <div className={styles.dashboard}>
        <h1>Teacher Dashboard</h1>
        <div className={styles.statsRow}>
          <StatsCard title="Classes" value={stats.classes} icon="📚" />
          <StatsCard title="Students" value={stats.students} icon="👨🎓" />
          <StatsCard title="Avg Attendance" value={stats.attendance} icon="✅" />
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboardPage;