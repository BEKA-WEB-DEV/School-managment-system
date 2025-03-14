import styles from './SystemHealthStatus.module.css';

const SystemHealthStatus = ({ status, timestamp, database }) => {
  return (
    <div className={styles.systemHealthStatus}>
      <h3>System Health</h3>
      <div className={styles.details}>
        <p>Status: <span className={styles.status}>{status}</span></p>
        <p>Last Checked: {timestamp}</p>
        <p>Database: {database}</p>
      </div>
    </div>
  );
};

export default SystemHealthStatus;