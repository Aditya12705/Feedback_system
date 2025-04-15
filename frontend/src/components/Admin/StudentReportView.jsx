import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/SharedStyles.css';
import '../../styles/DashboardStyles.css';

function StudentReportView() {
    const { studentId } = useParams();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/api/student-report/${studentId}`,
                    { 
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        } 
                    }
                );

                if (response.data && response.data.studentName) {
                    setReportData(response.data);
                } else {
                    throw new Error('Invalid data structure received');
                }
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.message || 'Failed to load report data');
                setReportData(null);
            } finally {
                setLoading(false);
            }
        }

        if (studentId) {
            fetchData();
        }
    }, [studentId]);

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (error || !reportData) {
        return <div className="error-message">{error || 'No data available'}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="report-header">
                <h1 className="report-title">Student Feedback Report</h1>
                <p className="report-subtitle">Detailed feedback analysis</p>
            </div>

            <div className="student-info-card">
                <div className="info-grid">
                    <div className="info-item">
                        <label>Name:</label>
                        <span>{reportData.studentName}</span>
                    </div>
                    <div className="info-item">
                        <label>USN:</label>
                        <span>{reportData.usn}</span>
                    </div>
                    <div className="info-item">
                        <label>Course:</label>
                        <span>{reportData.course}</span>
                    </div>
                    <div className="info-item">
                        <label>Semester:</label>
                        <span>{reportData.semester}</span>
                    </div>
                </div>
            </div>

            {reportData.feedback && reportData.feedback.map((facultyFeedback, index) => (
                <div key={index} className="feedback-section">
                    <h2>{facultyFeedback.facultyDetails}</h2>
                    <table className="feedback-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Score</th>
                                <th>Comment</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facultyFeedback.feedbackItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.question}</td>
                                    <td className="score-cell">{item.score}</td>
                                    <td>{item.comment || '-'}</td>
                                    <td>{item.feedbackType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default StudentReportView;