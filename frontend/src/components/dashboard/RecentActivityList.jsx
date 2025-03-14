import styles from './RecentActivityList.module.css';

const RecentActivityList = ({ activities }) => {
  return (
    <div className={styles.recentActivityList}>
      <h3>Recent Activity</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index} className={styles.activityItem}>
            <span>{activity.description}</span>
            <span>{activity.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityList;