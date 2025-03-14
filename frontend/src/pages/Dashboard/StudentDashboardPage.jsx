import { useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import { studentService } from '../../services/studentService';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './StudentDashboardPage.module.css';

const StudentDashboardPage = () => {
  const [stats, setStats] = useState({
    classes: 0,
    avgGrade: 'A-',
    attendance: '98%'
  });

  useEffect(() => {
    const fetchData = async () => {
      const schedule = await studentService().getSchedule();
      setStats(prev => ({
        ...prev,
        classes: schedule.length
      }));
    };
    fetchData();
  }, []);

  return (
    <MainLayout role="student">
      <div className={styles.dashboard}>
        <h1>Student Dashboard</h1>
        <div className={styles.statsRow}>
          <StatsCard title="Current Classes" value={stats.classes} icon="📖" />
          <StatsCard title="Average Grade" value={stats.avgGrade} icon="🎓" />
          <StatsCard title="Attendance" value={stats.attendance} icon="✓" />
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboardPage;