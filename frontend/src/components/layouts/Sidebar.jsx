// components/layouts/Sidebar/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ role }) => {
  // Role-based navigation items
  const navItems = {
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/registrar/students', label: 'Students' },
      { path: '/registrar/teachers', label: 'Teachers' },
      { path: '/academic/classes', label: 'Classes' },
      { path: '/academic/exams', label: 'Exams' },
      { path: '/teacher/attendance', label: 'Attendance' },
      { path: '/parent/payments', label: 'Payments' },
      { path: '/admin/users', label: 'User Management' },
      { path: '/admin/system', label: 'System Settings' }
    ],
    academic: [
      { path: '/academic/classes', label: 'Classes' },
      { path: '/academic/exams', label: 'Exam Schedule' }
    ],
    registrar: [
      { path: '/registrar/students', label: 'Students' },
      { path: '/registrar/teachers', label: 'Teachers' },
      { path: '/registrar/add-student', label: 'Add Student' },
      { path: '/registrar/add-teacher', label: 'Add Teacher' }
    ],
    teacher: [
      { path: '/teacher/classes', label: 'My Classes' },
      { path: '/teacher/attendance', label: 'Attendance' },
      { path: '/teacher/exams', label: 'Exams' }
    ],
    student: [
      { path: '/student/schedule', label: 'Schedule' },
      { path: '/student/grades', label: 'Grades' },
      { path: '/student/certifications', label: 'Certifications' }
    ],
    parent: [
      { path: '/parent/children', label: 'My Children' },
      { path: '/parent/payments', label: 'Payments' }
    ]
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <div className={styles.logo}>School Portal</div>
        <ul className={styles.navList}>
          {navItems[role]?.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;