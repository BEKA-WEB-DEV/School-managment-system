import styles from './CertificationItem.module.css';

const CertificationItem = ({ title, date, downloadLink }) => {
  return (
    <div className={styles.certificationItem}>
      <h3>{title}</h3>
      <p>Issued on: {date}</p>
      <a href={downloadLink} className={styles.downloadLink}>
        Download
      </a>
    </div>
  );
};

export default CertificationItem;