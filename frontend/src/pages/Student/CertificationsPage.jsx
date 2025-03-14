import { useEffect, useState } from 'react';
import CertificationItem from '../../components/student/CertificationItem';
import { studentService } from '../../services/studentService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './CertificationsPage.module.css';

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await studentService().getCertifications();
        setCertifications(data);
      } catch (err) {
        setError('Failed to load certifications');
      }
    };
    fetchCertifications();
  }, []);

  const handleDownload = async (certificationId) => {
    try {
      await studentService().downloadCertification(certificationId);
    } catch (err) {
      setError('Failed to download certification');
    }
  };

  return (
    <MainLayout role="student">
      <div className={styles.certificationsPage}>
        <h1>My Certifications</h1>
        {error && <Notification message={error} type="error" />}
        <div className={styles.certificationsGrid}>
          {certifications.map((cert) => (
            <CertificationItem
              key={cert.certification_id}
              title={cert.title}
              date={cert.issue_date}
              downloadLink={`/certifications/${cert.certification_id}/download`}
              onDownload={() => handleDownload(cert.certification_id)}
            />
          ))}
        </div>
        {certifications.length === 0 && !error && (
          <p className={styles.noCerts}>No certifications available</p>
        )}
      </div>
    </MainLayout>
  );
};

export default CertificationsPage;