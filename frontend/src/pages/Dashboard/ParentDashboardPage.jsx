import { useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import { parentService } from '../../services/parentService';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './ParentDashboardPage.module.css';

const ParentDashboardPage = () => {
  const [stats, setStats] = useState({
    children: 0,
    paymentsDue: 0,
    attendance: '97%'
  });

  useEffect(() => {
    const fetchData = async () => {
      const children = await parentService().getChildren();
      const payments = await parentService().getPaymentHistory();
      setStats({
        children: children.length,
        paymentsDue: payments.filter(p => p.status === 'pending').length,
        attendance: '97%'
      });
    };
    fetchData();
  }, []);

  return (
    <MainLayout role="parent">
      <div className={styles.dashboard}>
        <h1>Parent Dashboard</h1>
        <div className={styles.statsRow}>
          <StatsCard title="Children" value={stats.children} icon="👪" />
          <StatsCard title="Payments Due" value={stats.paymentsDue} icon="💳" />
          <StatsCard title="Avg Attendance" value={stats.attendance} icon="✅" />
        </div>
      </div>
    </MainLayout>
  );
};

export default ParentDashboardPage;