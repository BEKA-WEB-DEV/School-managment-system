// AdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import AcademicYearsCard from '../../components/system/AcademicYearsCard';
import SystemStatusCard from '../../components/system/SystemStatusCard';
import  {adminService}  from '../../services/adminService';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    // activeYears: 0,
    systemStatus: 'loading'
  });
  
  const useAdminService = adminService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, years] = await Promise.all([
          useAdminService.getUsers(),
          // useAdminService.getAcademicYears()
        ]);
        
        setStats({
          users: users.length,
          // activeYears: years.length,
          systemStatus: 'operational'
        });
      } catch (error) {
        console.error('Dashboard error:', error);
        setStats(prev => ({...prev, systemStatus: 'error'}));
      }
    };
    
    fetchData();
  }, []);

  return (
    <MainLayout role="admin">
      <div className={styles.dashboard}>
        <h1>School Management Dashboard</h1>
        
        <div className={styles.statsGrid}>
          <StatsCard 
            title="User Management" 
            value={stats.users} 
            icon="👥"
            route="/admin/users"
          />
          
          {/* <AcademicYearsCard 
            years={stats.activeYears}
            status={stats.systemStatus}
          /> */}
          
          <SystemStatusCard 
            status={stats.systemStatus}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;