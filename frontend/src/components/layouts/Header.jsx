import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService'; // Use hook-style import
import styles from './Header.module.css';

const Header = () => {
  const { user, logout } = useAuth(); // Use logout from useAuth
  const navigate = useNavigate();
  const useAuthService = authService(); // Initialize authService as a hook

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await useAuthService.logout(); // Call logout from authService
      logout(); // Clear user context
      navigate('/auth/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>School Management System</div>
      <nav className={styles.nav}>
        {user && (
          <div className={styles.welcomeMessage}>
            Welcome - {user.first_name} {user.last_name}
          </div>
        )}
        <NavLink 
          to={user ? `/${user.role}/dashboard` : '/auth/login'} 
          className={({ isActive }) => 
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => 
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          Profile
        </NavLink>
        <button 
          className={styles.navItem} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;