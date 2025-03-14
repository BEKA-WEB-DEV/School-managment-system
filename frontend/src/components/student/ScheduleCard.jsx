import styles from './ScheduleCard.module.css';

const ScheduleCard = ({ className, schedule, teacher, room }) => {
  return (
    <div className={styles.scheduleCard}>
      <h3>{className}</h3>
      <div className={styles.details}>
        <p>Schedule: {schedule}</p>
        <p>Teacher: {teacher}</p>
        <p>Room: {room}</p>
      </div>
    </div>
  );
};

export default ScheduleCard;