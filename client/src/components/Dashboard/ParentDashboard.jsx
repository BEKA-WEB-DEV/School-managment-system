// src/components/Dashboard/ParentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import  parentService  from '../../services/parentService';
import './ParentDashboard.css';

const ParentDashboard = () => {
    const [children, setChildren] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                // Fetch children data
                const childrenResponse = await parentService.getChildren();
                setChildren(childrenResponse.data);

                // Fetch exam results for all children
                const examResultsResponse = await parentService.getExamResultsForChildren(children.map(child => child.id));
                setExamResults(examResultsResponse.data);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchParentData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="parent-dashboard">
            <h2>Parents Dashboard</h2>
            <div className="dashboard-widgets">
                {/* Widgets */}
                <div className="widget">Due Fees: $4503</div>
                <div className="widget">Notifications: 12</div>
                <div className="widget">Result: 16</div>
                <div className="widget">Expenses: $193000</div>
            </div>
            <div className="my-kids">
                <h3>My Kids</h3>
                {children.map(child => (
                    <div key={child.id} className="child-info">
                        <img src={child.avatar} alt={`${child.name} avatar`} />
                        <div>
                            <p><strong>Name:</strong> {child.name}</p>
                            <p><strong>Gender:</strong> {child.gender}</p>
                            <p><strong>Class:</strong> {child.class}</p>
                            <p><strong>Roll:</strong> {child.roll}</p>
                            <p><strong>Section:</strong> {child.section}</p>
                            <p><strong>Admission Id:</strong> {child.admissionId}</p>
                            <p><strong>Admission Date:</strong> {child.admissionDate}</p>
                        </div>
                    </div>
                ))}
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

export default ParentDashboard;