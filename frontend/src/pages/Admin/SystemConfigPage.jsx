import { useState } from 'react';
import { adminService } from '../../services/adminService';
import Notification from '../../components/system/Notification';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './SystemConfigPage.module.css';

const SystemConfigPage = () => {
  const [configData, setConfigData] = useState({
    year: '',
    startDate: '',
    endDate: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService().configureAcademicYear(configData);
      setSuccess('Academic year configured successfully');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to configure academic year');
      setSuccess('');
    }
  };

  return (
    <MainLayout role="admin">
      <div className={styles.systemConfig}>
        <h1>System Configuration</h1>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}
        
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Academic Year (e.g., 2023-2024)"
            value={configData.year}
            onChange={(e) => setConfigData({...configData, year: e.target.value})}
            required
          />
          <Input
            type="date"
            label="Start Date"
            value={configData.startDate}
            onChange={(e) => setConfigData({...configData, startDate: e.target.value})}
            required
          />
          <Input
            type="date"
            label="End Date"
            value={configData.endDate}
            onChange={(e) => setConfigData({...configData, endDate: e.target.value})}
            required
          />
          <Button type="submit">Save Configuration</Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default SystemConfigPage;