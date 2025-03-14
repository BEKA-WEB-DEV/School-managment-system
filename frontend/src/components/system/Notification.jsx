import styles from './Notification.module.css';

const Notification = ({ message, type = 'info' }) => {
  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      {message}
    </div>
  );
};

export default Notification;