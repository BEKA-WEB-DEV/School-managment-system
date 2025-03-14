import styles from './StatsCard.module.css';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className={styles.statsCard}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;