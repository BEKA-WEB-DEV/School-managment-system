import { useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import { registrarService } from '../../services/registrarService';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './RegistrarDashboardPage.module.css';

const RegistrarDashboardPage = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    registrations: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const students = await registrarService().getStudents();
      const teachers = await registrarService().getTeachers();
      setStats({
        students: students.length,
        teachers: teachers.length,
        registrations: students.length + teachers.length
      });
    };
    fetchData();
  }, []);

  return (
    <MainLayout role="registrar">
      <div className={styles.dashboard}>
        <h1>Registrar Dashboard</h1>
        <div className={styles.statsRow}>
          <StatsCard title="Total Students" value={stats.students} icon="👨🎓" />
          <StatsCard title="Total Teachers" value={stats.teachers} icon="👩🏫" />
          <StatsCard title="Total Registrations" value={stats.registrations} icon="📝" />
        </div>
      </div>
    </MainLayout>
  );
};

export default RegistrarDashboardPage;