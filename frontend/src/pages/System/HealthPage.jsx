import { useEffect, useState } from 'react';
import SystemHealthStatus from '../../components/system/SystemHealthStatus';
import { useApi } from '../../hooks/useApi';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './HealthPage.module.css';

const HealthPage = () => {
  const { get } = useApi();
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await get('/api/health');
        setHealthData(data);
      } catch (err) {
        setError('Failed to fetch system health');
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout role="admin">
      <div className={styles.healthPage}>
        <h1>System Health Monitor</h1>
        {healthData ? (
          <SystemHealthStatus
            status={healthData.status}
            timestamp={healthData.timestamp}
            database={healthData.database}
          />
        ) : error ? (
          <Notification message={error} type="error" />
        ) : (
          <p>Loading system health data...</p>
        )}
      </div>
    </MainLayout>
  );
};

export default HealthPage;