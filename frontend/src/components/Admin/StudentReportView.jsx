import React, { useEffect, useState } from 'react';
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
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Process and structure the data
                const data = response.data;
                if (!data || !data.feedback) {
                    throw new Error('Invalid data structure received');
                }

                // Group feedback by faculty and feedback type
                const processedData = {
                    studentInfo: {
                        name: data.studentName,
                        usn: data.usn,
                        course: data.course,
                        semester: data.semester
                    },
                    feedback: data.feedback.map(fb => ({
                        facultyDetails: fb.facultyDetails,
                        feedbackItems: fb.feedbackItems.sort((a, b) => a.questionId - b.questionId)
                    }))
                };

                setReportData(processedData);
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Failed to load report data');
                setReportData(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [studentId]);

    if (loading) {
        return (
            <div className="dashboard-container" style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="loading-spinner"></div>
                <p>Loading report data...</p>
            </div>
        );
    }

    if (error || !reportData) {
        return (
            <div className="dashboard-container" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Error Loading Report</h2>
                <p className="error-message">{error || 'Failed to load report data'}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="report-header">
                <h1 className="report-title">Student Feedback Report</h1>
                <p className="report-subtitle">Comprehensive feedback analysis</p>
            </div>

            <div className="student-info-card">
                <h2 style={{ color: '#003087', marginBottom: '1.5rem' }}>
                    {reportData.studentInfo.name}
                </h2>
                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-label">USN</div>
                        <div className="info-value">{reportData.studentInfo.usn}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Course</div>
                        <div className="info-value">{reportData.studentInfo.course}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Semester</div>
                        <div className="info-value">{reportData.studentInfo.semester}</div>
                    </div>
                </div>
            </div>

            {reportData.feedback.map((facultyFeedback, index) => (
                <div key={index} className="dashboard-card feedback-section">
                    <h2 className="section-title">{facultyFeedback.facultyDetails}</h2>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50%' }}>Question</th>
                                <th style={{ width: '100px' }}>Score</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facultyFeedback.feedbackItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.question}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className="score-badge" 
                                              style={{
                                                  background: getScoreColor(item.score),
                                                  padding: '0.25rem 0.75rem',
                                                  borderRadius: '12px',
                                                  color: 'white',
                                                  fontWeight: '600'
                                              }}>
                                            {item.score}
                                        </span>
                                    </td>
                                    <td style={{ color: item.comment ? '#2c3e50' : '#6c757d' }}>
                                        {item.comment || 'No comment provided'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

function getScoreColor(score) {
    const colors = {
        1: '#dc3545',
        2: '#ffc107',
        3: '#6c757d',
        4: '#28a745',
        5: '#003087'
    };
    return colors[score] || '#6c757d';
}

export default StudentReportView;