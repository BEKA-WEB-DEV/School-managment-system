// src/components/Common/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Dashboard,
    People,
    Person,
    Book,
    AccountBalanceWallet,
    Close,
    ChevronRight,
    School,
    CalendarToday,
    Assignment,
    LocalTaxi,
    Hotel,
    Notifications,
    Message,
    Map,
} from '@mui/icons-material';
import './Sidebar.css';

const Sidebar = ({ role }) => {
    const menuItems = [
        { icon: <Dashboard />, label: 'Dashboard', path: '/dashboard', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <People />, label: 'Students', path: '/students', roles: ['admin'] },
        { icon: <Person />, label: 'Teachers', path: '/teachers', roles: ['admin'] },
        { icon: <Person />, label: 'Parents', path: '/parents', roles: ['admin'] },
        { icon: <Book />, label: 'Library', path: '/library', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <AccountBalanceWallet />, label: 'Account', path: '/account', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Close />, label: 'Class', path: '/class', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Subject', path: '/subject', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Class Routine', path: '/class-routine', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Attendance', path: '/attendance', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Exam', path: '/exam', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Transport', path: '/transport', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Hostel', path: '/hostel', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Notice', path: '/notice', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Message', path: '/message', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'UI Elements', path: '/ui-elements', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Map', path: '/map', roles: ['student', 'parent', 'teacher', 'admin'] },
        { icon: <Book />, label: 'Account', path: '/account', roles: ['student', 'parent', 'teacher', 'admin'] },
    ];

    return (
        <div className="sidebar">
            <div className="logo">
                <img src="/path/to/logo.png" alt="Logo" />
                <span>AKKHOR</span>
            </div>
            <ul className="menu">
                {menuItems.map((item) => (
                    role && item.roles.includes(role) ? (
                        <li key={item.path} className="menu-item">
                            <Link to={item.path} className="menu-link">
                                {item.icon}
                                <span>{item.label}</span>
                                <ChevronRight className="chevron" />
                            </Link>
                        </li>
                    ) : null
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;