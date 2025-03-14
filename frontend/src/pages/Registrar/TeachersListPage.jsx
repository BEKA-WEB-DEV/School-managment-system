import { useEffect, useState } from 'react';
import { registrarService } from '../../services/registrarService';
import MainLayout from '../../components/layouts/MainLayout';
import Notification from '../../components/system/Notification';
import styles from './TeachersListPage.module.css';

const TeachersListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const useRegistrarService = registrarService();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await useRegistrarService.getTeachers();
        setTeachers(data);
      } catch (err) {
        setError('Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <MainLayout role="registrar">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Teachers List</h1>
          <button className={styles.addButton} onClick={() => window.location.href='/registrar/add-teacher'}>
            + Add New Teacher
          </button>
        </div>

        {error && <Notification message={error} type="error" />}

        {loading ? (
          <div className={styles.loading}>Loading teachers...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.teacherTable}>
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td>{teacher.teacher_id}</td>
                    <td>{`${teacher.first_name} ${teacher.last_name}`}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.class}</td>
                    <td>
                      <button className={styles.editButton}>Edit</button>
                      <button className={styles.deleteButton}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeachersListPage;