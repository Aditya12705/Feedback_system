import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentReportView = () => {
    const { studentId } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/api/student-report/${studentId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log('Raw API response:', response.data); // Debug log
                if (response.data) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load feedback data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!data.feedback || data.feedback.length === 0) return <div>No feedback available</div>;

    const renderFeedbackTable = (facultyFeedback) => (
        <div key={facultyFeedback.facultyDetails} style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                {facultyFeedback.facultyDetails}
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#003087', color: '#fff' }}>Feedback Type</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#003087', color: '#fff' }}>Question</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#003087', color: '#fff', width: '100px' }}>Score</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#003087', color: '#fff' }}>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {facultyFeedback.feedbackItems.map((item, idx) => (
                        <tr key={idx}>
                            <td style={{ 
                                border: '1px solid #ddd', 
                                padding: '12px',
                                backgroundColor: item.feedbackType === 'Pre-Feedback' ? '#e3f2fd' : '#fff3e0',
                                color: item.feedbackType === 'Pre-Feedback' ? '#1976d2' : '#f57c00',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}>
                                {item.feedbackType}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.question}</td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                                {item.score}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.comment || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#003087', marginBottom: '30px' }}>Student Feedback Report</h1>
            
            <div style={{ 
                marginBottom: '30px', 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <p><strong>Name:</strong> {data.studentName}</p>
                <p><strong>USN:</strong> {data.usn}</p>
                <p><strong>Course:</strong> {data.course}</p>
                <p><strong>Semester:</strong> {data.semester}</p>
            </div>

            {data.feedback.map(facultyFeedback => renderFeedbackTable(facultyFeedback))}
        </div>
    );
};

export default StudentReportView;