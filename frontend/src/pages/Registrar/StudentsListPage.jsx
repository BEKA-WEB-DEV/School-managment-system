import { useEffect, useState } from 'react';
import { registrarService } from '../../services/registrarService';
import MainLayout from '../../components/layouts/MainLayout';
import Notification from '../../components/system/Notification';
import styles from './StudentsListPage.module.css';

const StudentsListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const useRegistrarService = registrarService();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await useRegistrarService.getStudents();
        console.log('Fetched data:', data);
        // Check if data is an array, if not try to extract the array from a property or fallback to an empty array.
        const studentsArray = Array.isArray(data) ? data : data.students || [];
        setStudents(studentsArray);
      } catch (err) {
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <MainLayout role="registrar">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Students List</h1>
          <button
            className={styles.addButton}
            onClick={() => (window.location.href = '/registrar/add-student')}
          >
            + Add New Student
          </button>
        </div>

        {error && <Notification message={error} type="error" />}

        {loading ? (
          <div className={styles.loading}>Loading students...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.studentTable}>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Class</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(students) && students.length > 0 ? (
                  students.map(student => (
                    <tr key={student.id}>
                      <td>{student.student_id}</td>
                      <td>{`${student.first_name} ${student.last_name}`}</td>
                      <td>{student.email}</td>
                      <td>
                        <span className={`${styles.status} ${styles[student.status]}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>{student.class}</td>
                      <td>
                        <button className={styles.editButton}>Edit</button>
                        <button className={styles.deleteButton}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudentsListPage;
