import styles from './SystemCards.module.css';

const AcademicYearsCard = ({ years, status = 'loading' }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Academic Years</h3>
      <div className={styles.yearContainer}>
        <div className={styles.yearCount}>{years}</div>
        <div className={`${styles.statusBadge} ${styles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default AcademicYearsCard;