import { useState } from 'react';
import useApi  from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Notification from '../../components/system/Notification';
import AuthLayout from '../../components/layouts/AuthLayout';
import styles from './InstallationPage.module.css';

const InstallationPage = () => {
  const { post } = useApi();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInstall = async () => {
    try {
      const response = await post('/api/install');
      setResult(response);
      setError('');
    } catch (err) {
      setError('Installation failed: ' + err.message);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.installationPage}>
        <h1>System Installation</h1>
        <p className={styles.warning}>⚠️ One-time database setup ⚠️</p>
        {result ? (
          <Notification message={result.message} type="success" />
        ) : error ? (
          <Notification message={error} type="error" />
        ) : (
          <Button onClick={handleInstall} disabled={!!result}>
            Initialize Database
          </Button>
        )}
      </div>
    </AuthLayout>
  );
};

export default InstallationPage;