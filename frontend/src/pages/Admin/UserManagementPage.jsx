import { useEffect, useState } from 'react';
import UserTable from '../../components/admin/UserTable';
import UserForm from '../../components/admin/UserForm';
import { adminService } from '../../services/adminService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './UserManagementPage.module.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Call adminService once here
  const adminServiceInstance = adminService();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await adminServiceInstance.getUsers();

        if (Array.isArray(response)) {
          setUsers(response);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // Important: no dependencies here so it doesn't refetch continuously
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);
      setError('');
      const newUser = await adminServiceInstance.createUser(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout role="admin">
      <div className={styles.userManagement}>
        <h1>User Management</h1>
        {error && <Notification message={error} type="error" />}

        <div className={styles.section}>
          <h2>Create New User</h2>
          <UserForm onSubmit={handleCreateUser} loading={loading} />
        </div>

        <div className={styles.section}>
          <h2>Existing Users</h2>
          {loading ? (
            <div className={styles.loading}>Loading users...</div>
          ) : users.length > 0 ? (
            <UserTable users={users} />
          ) : (
            <div className={styles.noUsers}>No users found</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserManagementPage;
