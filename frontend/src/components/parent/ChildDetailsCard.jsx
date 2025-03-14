import styles from './ChildDetailsCard.module.css';

const ChildDetailsCard = ({ child }) => {
  return (
    <div className={styles.childDetailsCard}>
      <h3>{child.name}</h3>
      <div className={styles.details}>
        <p>Grade: {child.grade}</p>
        <p>Class: {child.class}</p>
        <p>Teacher: {child.teacher}</p>
      </div>
    </div>
  );
};

export default ChildDetailsCard;