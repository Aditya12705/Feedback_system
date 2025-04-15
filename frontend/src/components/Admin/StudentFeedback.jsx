import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import './StudentFeedback.css';

const StudentFeedback = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [course, setCourse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching data for:', { semester: selectedSemester, course });

            const response = await axios.get(
                `http://localhost:5000/api/feedback/admin/feedback`, {
                    params: {
                        semester: selectedSemester,
                        course: course
                    },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            if (response.data.success) {
                if (response.data.data.length === 0) {
                    setError(`No feedback data available for semester ${selectedSemester}`);
                }
                setFeedbackData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.message || 'Failed to fetch feedback data');
        } finally {
            setLoading(false);
        }
    }, [selectedSemester, course]);

    useEffect(() => {
        if (selectedSemester && course) {
            fetchData();
        }
    }, [selectedSemester, course, fetchData]);

    const handleSemesterChange = (e) => {
        const newSemester = e.target.value;
        setSelectedSemester(newSemester);
    };

    const handleCourseChange = (e) => {
        const newCourse = e.target.value;
        setCourse(newCourse);
    };

    return (
        <div className="student-feedback-container">
            <h2>Student Feedback</h2>
            <div className="filters">
                <select 
                    value={selectedSemester} 
                    onChange={handleSemesterChange}
                    className="semester-dropdown"
                >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                </select>
                <select 
                    value={course} 
                    onChange={handleCourseChange}
                    className="course-dropdown"
                >
                    <option value="">Select Course</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                </select>
            </div>
            
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            {!loading && !error && feedbackData.length === 0 && (
                <div className="no-data">No feedback data available for the selected semester</div>
            )}
            {!loading && !error && feedbackData.length > 0 && (
                <table className="feedback-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>USN</th>
                            <th>Semester</th>
                            <th>Course</th>
                            <th>Feedback Type</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackData.map((feedback, index) => (
                            <tr key={index}>
                                <td>{feedback.studentName}</td>
                                <td>{feedback.usn}</td>
                                <td>{feedback.semester}</td>
                                <td>{feedback.course}</td>
                                <td>{feedback.feedbackType}</td>
                                <td>{feedback.feedback}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentFeedback;