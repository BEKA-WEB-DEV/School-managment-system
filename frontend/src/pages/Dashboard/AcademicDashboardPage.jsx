import { useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import  {academicService}  from '../../services/academicService';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './AcademicDashboardPage.module.css';

const AcademicDashboardPage = () => {
  const [stats, setStats] = useState({
    classes: 0,
    exams: 0,
    studentsEnrolled: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const classes = await academicService().getClasses();
      const exams = await academicService().getExams();
      setStats({
        classes: classes.length,
        exams: exams.length,
        studentsEnrolled: classes.reduce((acc, cls) => acc + cls.student_count, 0)
      });
    };
    fetchData();
  }, []);

  return (
    <MainLayout role="academic">
      <div className={styles.dashboard}>
        <h1>Academic Dashboard</h1>
        <div className={styles.statsRow}>
          <StatsCard title="Active Classes" value={stats.classes} icon="📚" />
          <StatsCard title="Upcoming Exams" value={stats.exams} icon="📝" />
          <StatsCard title="Students Enrolled" value={stats.studentsEnrolled} icon="👥" />
        </div>
      </div>
    </MainLayout>
  );
};

export default AcademicDashboardPage;