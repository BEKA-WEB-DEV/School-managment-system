// src/components/Dashboard/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import  teacherService  from '../../services/teacherService';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const [stats, setStats] = useState({});
    const [students, setStudents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                // Fetch teacher stats
                const statsResponse = await teacherService.getTeacherStats();
                setStats(statsResponse.data);

                // Fetch assigned students
                const studentsResponse = await teacherService.getAssignedStudents();
                setStudents(studentsResponse.data);

                // Fetch notifications
                const notificationsResponse = await teacherService.getNotifications();
                setNotifications(notificationsResponse.data);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="teacher-dashboard">
            <h2>Teachers Dashboard</h2>
            <div className="dashboard-widgets">
                <div className="widget">Total Students: {stats.totalStudents}</div>
                <div className="widget">Total Exams: {stats.totalExams}</div>
                <div className="widget">Graduate Students: {stats.graduateStudents}</div>
            </div>
            <div className="student-stats">
                <h3>Students</h3>
                {/* Placeholder for a pie chart */}
                <div className="pie-chart">
                    {/* Add your pie chart component here */}
                </div>
            </div>
            <div className="notifications">
                <h3>Notifications</h3>
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>
                            <strong>{notification.date}</strong>: {notification.message} - {notification.sender}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="my-students">
                <h3>My Students</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Roll</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Parents</th>
                            <th>Address</th>
                            <th>Date Of Birth</th>
                            <th>Phone</th>
                            <th>E-mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.roll}</td>
                                <td>{student.name}</td>
                                <td>{student.gender}</td>
                                <td>{student.class}</td>
                                <td>{student.section}</td>
                                <td>{student.parents}</td>
                                <td>{student.address}</td>
                                <td>{student.dateOfBirth}</td>
                                <td>{student.phone}</td>
                                <td>{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherDashboard;