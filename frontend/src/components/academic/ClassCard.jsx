import styles from './ClassCard.module.css';

const ClassCard = ({ className, teacher, subject, schedule }) => {
  return (
    <div className={styles.classCard}>
      <h3>{className}</h3>
      <div className={styles.details}>
        <p>Teacher: {teacher}</p>
        <p>Subject: {subject}</p>
        <p>Schedule: {schedule}</p>
      </div>
    </div>
  );
};

export default ClassCard;