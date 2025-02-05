// src/components/Layout/Layout.jsx
import React from 'react';
import Sidebar from '../Common/Sidebar';
// import './Layout.css';

const Layout = ({ children, role }) => {
    return (
        <div className="layout">
            <Sidebar role={role} />
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;

// // src/components/Common/Navbar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Navbar.css';

// const Navbar = ({ role }) => {
//     return (
//         <nav className="navbar">
//             <ul>
//                 <li><Link to="/">Home</Link></li>
//                 {role === 'student' && (
//                     <>
//                         <li><Link to="/dashboard/student">Student Dashboard</Link></li>
//                         <li><Link to="/certifications">Certifications</Link></li>
//                     </>
//                 )}
//                 {role === 'parent' && (
//                     <>
//                         <li><Link to="/dashboard/parent">Parent Dashboard</Link></li>
//                         <li><Link to="/child-grades">Child Grades</Link></li>
//                     </>
//                 )}
//                 {role === 'teacher' && (
//                     <>
//                         <li><Link to="/dashboard/teacher">Teacher Dashboard</Link></li>
//                         <li><Link to="/class-schedule">Class Schedule</Link></li>
//                     </>
//                 )}
//                 {role === 'admin' && (
//                     <>
//                         <li><Link to="/dashboard/admin">Admin Dashboard</Link></li>
//                         <li><Link to="/manage-users">Manage Users</Link></li>
//                     </>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;