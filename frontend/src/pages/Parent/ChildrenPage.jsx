import { useEffect, useState } from 'react';
import ChildDetailsCard from '../../components/parent/ChildDetailsCard';
import { parentService } from '../../services/parentService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './ChildrenPage.module.css';

const ChildrenPage = () => {
  const [children, setChildren] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await parentService().getChildren();
        setChildren(data);
      } catch (err) {
        setError('Failed to load children data');
      }
    };
    fetchChildren();
  }, []);

  return (
    <MainLayout role="parent">
      <div className={styles.childrenPage}>
        <h1>My Children</h1>
        {error && <Notification message={error} type="error" />}
        <div className={styles.childrenGrid}>
          {children.map((child) => (
            <ChildDetailsCard
              key={child.student_id}
              child={child}
            />
          ))}
        </div>
        {children.length === 0 && !error && (
          <p className={styles.noChildren}>No children registered</p>
        )}
      </div>
    </MainLayout>
  );
};

export default ChildrenPage;