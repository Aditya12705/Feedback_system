import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeedbackViewer.css';

const FeedbackViewer = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/feedback/admin/feedback', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    // Process and group feedback data by student and faculty
                    const processedData = response.data.data.reduce((acc, item) => {
                        // Create a unique key using student, faculty, and feedback type
                        const key = `${item.student_id}-${item.faculty_id}-${item.feedbackType}-${item.selected_faculty || item.faculty_name}`;
                        
                        if (!acc[key]) {
                            acc[key] = {
                                studentId: item.student_id,
                                studentName: item.student_name,
                                facultyName: item.selected_faculty || item.faculty_name, // Use selected faculty if available
                                subjectName: item.subjectName,
                                feedbackType: item.feedbackType,
                                semester: item.semester,
                                courseName: item.courseName,
                                scores: [],
                                comments: item.comment || ''
                            };
                        }

                        // Add score with question details
                        acc[key].scores.push({
                            questionId: item.question_id,
                            score: item.score,
                            questionText: item.question_text
                        });

                        return acc;
                    }, {});

                    // Sort feedback data by semester, student ID, and feedback type
                    const sortedData = Object.values(processedData).sort((a, b) => {
                        if (a.semester !== b.semester) return a.semester - b.semester;
                        if (a.studentId !== b.studentId) return a.studentId.localeCompare(b.studentId);
                        return a.feedbackType.localeCompare(b.feedbackType);
                    });

                    setFeedbackData(sortedData);
                }
            } catch (err) {
                console.error('Error fetching feedback:', err);
                setError('Failed to load feedback data');
            }
        };

        fetchFeedback();
    }, []);

    // Add filters state
    const [filters, setFilters] = useState({
        semester: '',
        course: '',
        feedbackType: ''
    });

    // Filter the feedback data
    const filteredFeedback = feedbackData.filter(data => {
        return (
            (!filters.semester || data.semester.toString() === filters.semester) &&
            (!filters.course || data.courseName.toLowerCase().includes(filters.course.toLowerCase())) &&
            (!filters.feedbackType || data.feedbackType === filters.feedbackType)
        );
    });

    return (
        <div className="feedback-viewer-container">
            <h2>Feedback Viewer</h2>
            {error && <p className="error">{error}</p>}
            
            {/* Add filter controls */}
            <div className="filters">
                <select 
                    value={filters.semester} 
                    onChange={e => setFilters(prev => ({...prev, semester: e.target.value}))}
                >
                    <option value="">All Semesters</option>
                    {[...new Set(feedbackData.map(d => d.semester))].sort().map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                    ))}
                </select>

                <select 
                    value={filters.course} 
                    onChange={e => setFilters(prev => ({...prev, course: e.target.value}))}
                >
                    <option value="">All Courses</option>
                    {[...new Set(feedbackData.map(d => d.courseName))].sort().map(course => (
                        <option key={course} value={course}>{course}</option>
                    ))}
                </select>

                <select 
                    value={filters.feedbackType} 
                    onChange={e => setFilters(prev => ({...prev, feedbackType: e.target.value}))}
                >
                    <option value="">All Feedback Types</option>
                    <option value="Pre-Feedback">Pre-Feedback</option>
                    <option value="Post-Feedback">Post-Feedback</option>
                </select>
            </div>

            {filteredFeedback.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Faculty Name</th>
                            <th>Subject Name</th>
                            <th>Feedback Type</th>
                            <th>Semester</th>
                            <th>Course Name</th>
                            <th>Scores</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFeedback.map((data, index) => (
                            <tr key={`${data.studentId}-${data.facultyName}-${data.feedbackType}-${index}`}>
                                <td>{data.studentId}</td>
                                <td>{data.studentName}</td>
                                <td>{data.facultyName}</td>
                                <td>{data.subjectName}</td>
                                <td className={`feedback-type ${data.feedbackType.toLowerCase()}`}>
                                    {data.feedbackType}
                                </td>
                                <td>{data.semester}</td>
                                <td>{data.courseName}</td>
                                <td className="scores-cell">
                                    {data.scores.sort((a, b) => a.questionId - b.questionId).map((score, idx) => (
                                        <div key={idx} className="score-item">
                                            <strong>Q{score.questionId}:</strong> 
                                            <span className="score">{score.score}</span>
                                            <span className="question-text">{score.questionText}</span>
                                        </div>
                                    ))}
                                </td>
                                <td>{data.comments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FeedbackViewer;