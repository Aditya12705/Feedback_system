import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function StudentReportView() {
    const { studentId } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/api/student-report/${studentId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log('API Response:', response.data); // Debugging log
                const responseData = response.data || [];
                setData(Array.isArray(responseData) ? responseData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [studentId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Debugging log for the `data` state
    console.log('Data state:', data);

    const groupedFeedback = data.reduce((acc, item) => {
        if (item && item.facultyName && item.subject) {
            const key = `${item.facultyName} - ${item.subject}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
        }
        return acc;
    }, {});

    // Debugging log for `groupedFeedback`
    console.log('Grouped Feedback:', groupedFeedback);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Student Feedback Report</h1>
            {groupedFeedback && Object.keys(groupedFeedback).length > 0 ? (
                Object.entries(groupedFeedback).map(([key, feedbacks]) => (
                    <div key={key} style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>{key}</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f8f9fa' }}>Question</th>
                                    <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f8f9fa' }}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((feedback, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ddd', padding: '12px' }}>{feedback.question}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>{feedback.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <div>No feedback available</div>
            )}
        </div>
    );
}

export default StudentReportView;