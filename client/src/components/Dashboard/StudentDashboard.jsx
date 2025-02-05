// src/components/Dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import  studentService  from '../../services/studentService';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [student, setStudent] = useState({});
    const [examResults, setExamResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Fetch student data
                const studentResponse = await studentService.getStudentById(id);
                setStudent(studentResponse.data);

                // Fetch exam results for the student
                const examResultsResponse = await studentService.getExamResultsByStudentId(id);
                setExamResults(examResultsResponse.data);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="student-dashboard">
            <h2>Student Dashboard</h2>
            <div className="dashboard-widgets">
                {/* Widgets */}
                <div className="widget">Notifications: 12</div>
                <div className="widget">Events: 6</div>
                <div className="widget">Attendance: 94%</div>
            </div>
            <div className="about-me">
                <h3>About Me</h3>
                <img src={student.avatar} alt={`${student.name} avatar`} />
                <div>
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Gender:</strong> {student.gender}</p>
                    <p><strong>Father Name:</strong> {student.fatherName}</p>
                    <p><strong>Mother Name:</strong> {student.motherName}</p>
                    <p><strong>Date Of Birth:</strong> {student.dob}</p>
                    <p><strong>Religion:</strong> {student.religion}</p>
                    <p><strong>Father Occupation:</strong> {student.fatherOccupation}</p>
                    <p><strong>E-Mail:</strong> {student.email}</p>
                    <p><strong>Admission Date:</strong> {student.admissionDate}</p>
                    <p><strong>Class:</strong> {student.class}</p>
                    <p><strong>Section:</strong> {student.section}</p>
                    <p><strong>Roll:</strong> {student.roll}</p>
                    <p><strong>Address:</strong> {student.address}</p>
                    <p><strong>Phone:</strong> {student.phone}</p>
                </div>
            </div>
            <div className="all-exam-results">
                <h3>All Exam Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Exam Name</th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Roll</th>
                            <th>Grade</th>
                            <th>Percent</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examResults.map(result => (
                            <tr key={result.id}>
                                <td>{result.id}</td>
                                <td>{result.examName}</td>
                                <td>{result.subject}</td>
                                <td>{result.class}</td>
                                <td>{result.roll}</td>
                                <td>{result.grade}</td>
                                <td>{result.percent}</td>
                                <td>{result.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentDashboard;