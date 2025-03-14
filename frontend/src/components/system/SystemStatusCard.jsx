import styles from './SystemCards.module.css';

const SystemStatusCard = ({ status = 'loading' }) => {
  const statusLabels = {
    operational: 'Operational',
    loading: 'Loading',
    error: 'System Error'
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>System Status</h3>
      <div className={styles.statusContainer}>
        <div className={`${styles.statusIndicator} ${styles[status]}`} />
        <span className={styles.statusText}>
          {statusLabels[status] || 'Unknown Status'}
        </span>
      </div>
    </div>
  );
};

export default SystemStatusCard;