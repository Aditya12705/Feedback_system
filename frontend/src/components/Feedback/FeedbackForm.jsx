import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './FeedbackForm.css';

const FeedbackForm = () => {
    const [faculties, setFaculties] = useState([]);
    const [feedback, setFeedback] = useState({});
    const [questions, setQuestions] = useState([]);
    const [feedbackType, setFeedbackType] = useState(null); // Initially null
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [studentInfo, setStudentInfo] = useState(null); // New state for student info
    const [academicYear, setAcademicYear] = useState(''); // New state for academic year
    const [semester, setSemester] = useState(''); // New state for semester
    const [feedbackStatus, setFeedbackStatus] = useState({ preFeedback: false, postFeedback: false }); // New state for feedback status
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in localStorage.');
                    setError('Authentication token is missing. Redirecting to login...');
                    setTimeout(() => navigate('/'), 2000);
                    return;
                }

                // Clear any cached feedback status
                localStorage.removeItem('feedbackSubmitted');
                localStorage.removeItem(`feedbackSubmitted_${studentInfo?.studentId}`);

                console.log('Sending token to backend:', token); // Debugging log
                const response = await axios.get('http://localhost:5000/api/student/info', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Student Info Response:', response.data); // Debugging log
                setStudentInfo(response.data); // Ensure studentInfo is set correctly
            } catch (err) {
                console.error('Error fetching student info:', err.response?.data || err); // Debugging log
                setError(err.response?.data?.message || 'Failed to load student info. Please try again.');
            }
        };

        fetchStudentInfo();
    }, [navigate, studentInfo?.studentId]);

    const fetchFaculties = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !semester) return;
            const response = await axios.get(
                `http://localhost:5000/api/feedback/faculties`, 
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    params: { semester } // Pass selected semester
                }
            );

            if (response.data.length === 0) {
                setError('No faculties found for selected semester');
                return;
            }

            console.log('Fetched faculties:', response.data);
            setFaculties(response.data);
            
            // Initialize feedback state
            const initialFeedback = {};
            response.data.forEach(faculty => {
                initialFeedback[faculty.id] = {
                    scores: Array(26).fill(''),
                    comment: '',
                    selectedFaculty: faculty.isElective ? '' : null
                };
            });
            setFeedback(initialFeedback);
        } catch (err) {
            console.error('Error fetching faculties:', err);
            setError(err.response?.data?.message || 'Failed to load faculties');
            setFaculties([]);
        }
    }, [semester]);

    const fetchQuestions = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!feedbackType || !semester) return; // Fetch questions only after feedbackType and semester are selected
            const response = await axios.get(
                `http://localhost:5000/api/feedback/questions/${feedbackType}?semester=${semester}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestions(response.data);
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError('Failed to load questions');
        }
    }, [feedbackType, semester]);

    useEffect(() => {
        if (semester && feedbackType) {
            setFaculties([]);
            setQuestions([]);
            fetchFaculties();
            fetchQuestions();
        }
    }, [semester, feedbackType, fetchFaculties, fetchQuestions]);

    const checkFeedbackStatus = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const studentId = studentInfo?.studentId;
            if (!token || !studentId || !semester) return;

            // Check status for both semesters
            const response = await axios.get(
                `http://localhost:5000/api/feedback/status/${studentId}?semester=${semester}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setFeedbackStatus(response.data);
        } catch (error) {
            console.error('Error checking feedback status:', error);
            setFeedbackStatus({ preFeedback: false, postFeedback: false });
        }
    }, [studentInfo, semester]); // Add semester as dependency

    useEffect(() => {
        if (studentInfo?.studentId && semester) {
            checkFeedbackStatus();
        }
    }, [studentInfo, semester, checkFeedbackStatus]);

    const handleFeedbackTypeChange = async (type) => {
        if (!academicYear || !semester) {
            setError('Please select both academic year and semester before proceeding.');
            return;
        }
        
        // Refresh feedback status before changing type
        await checkFeedbackStatus();
        
        if (type === 'Post-Feedback' && !feedbackStatus.preFeedback) {
            setError('Please submit Pre-Feedback first');
            return;
        }
        
        setError(''); // Clear any existing errors
        setFeedbackType(type);
        setFeedback({});
        setFaculties([]);
        setQuestions([]);
    };

    const handleQuestionChange = (facultyId, questionIndex, value) => {
        const clampedValue = Math.max(1, Math.min(5, parseInt(value))); // Clamp value between 1 and 5
        setFeedback((prev) => {
            const updated = { ...prev };
            updated[facultyId].scores[questionIndex] = clampedValue;
            return updated;
        });
    };

    const handleElectiveChange = (facultyId, selectedFaculty) => {
        setFeedback((prev) => ({
            ...prev,
            [facultyId]: {
                ...prev[facultyId],
                selectedFaculty,
            },
        }));
    };

    const resetForm = () => {
        setFeedback({});
        setQuestions([]);
        setFaculties([]);
    };

    const handleSemesterChange = (e) => {
        const newSemester = e.target.value;
        setSemester(newSemester);
        // Reset feedback type when semester changes
        setFeedbackType(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const feedbackData = Object.entries(feedback).map(([facultyId, data]) => ({
                facultyId: parseInt(facultyId),
                scores: data.scores.map(s => parseInt(s) || 0),
                selectedFaculty: data.selectedFaculty || '',
                comment: data.comment || '',
                semester: parseInt(semester) // Add semester to payload
            }));

            const response = await axios.post(
                'http://localhost:5000/api/feedback/submit',
                {
                    feedback: feedbackData,
                    feedbackType,
                    semester: parseInt(semester) // Add semester to the payload
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            if (response.data.success) {
                setFeedbackStatus(prev => ({
                    ...prev,
                    [feedbackType === 'Pre-Feedback' ? 'preFeedback' : 'postFeedback']: true
                }));
                alert(`${feedbackType} submitted successfully!`);
                resetForm();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const renderFacultyHeaders = () => (
        <thead>
            <tr>
                <th className="question-header">Q No</th>
                <th className="question-header">Question</th>
                {faculties.map((faculty) => (
                    <th key={faculty.id} className="faculty-header">
                        <div className="faculty-box">
                            <p>{faculty.subjectName || 'N/A'}</p>
                            {faculty.isElective ? (
                                <select
                                    className="elective-dropdown"
                                    onChange={(e) => handleElectiveChange(faculty.id, e.target.value)}
                                    value={feedback[faculty.id]?.selectedFaculty || ''}
                                    required={faculty.isElective}
                                >
                                    <option value="">Select Faculty</option>
                                    {faculty.facultyName.split('/').map((name, index) => (
                                        <option key={`${faculty.id}-${index}`} value={name.trim()}>
                                            {name.trim()}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p>{faculty.facultyName || 'N/A'}</p>
                            )}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );

    const renderQuestions = () => (
        <tbody>
            {questions.map((question, index) => (
                <tr key={index}>
                    <td className="question-number">{index + 1}</td>
                    <td className="question-text">{question}</td>
                    {faculties.map((faculty) => (
                        <td key={`${faculty.id}-${index}`} className="response-cell">
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={feedback[faculty.id]?.scores[index] || ''}
                                onChange={(e) =>
                                    handleQuestionChange(faculty.id, index, e.target.value)
                                }
                                required
                            />
                        </td>
                    ))}
                </tr>
            ))}
            <tr>
                <td className="question-number">{questions.length + 1}</td>
                <td className="question-text">Comment</td>
                {faculties.map((faculty) => (
                    <td key={`${faculty.id}-comment`} className="response-cell">
                        <textarea
                            className="comment-box"
                            value={feedback[faculty.id]?.comment || ''}
                            onChange={(e) =>
                                setFeedback((prev) => ({
                                    ...prev,
                                    [faculty.id]: {
                                        ...prev[faculty.id],
                                        comment: e.target.value,
                                    },
                                }))
                            }
                            placeholder="Enter your comment here"
                        />
                    </td>
                ))}
            </tr>
        </tbody>
    );

    return (
        <div className="feedback-container">
            <h2>Faculty Feedback Form</h2>
            {error && <p className="error">{error}</p>}

            {studentInfo ? (
                <div className="student-info">
                    <p><strong>Name:</strong> {studentInfo.name}</p>
                    <p><strong>USN:</strong> {studentInfo.studentId}</p>
                    <p><strong>Course:</strong> {studentInfo.course.toUpperCase()}</p>
                </div>
            ) : (
                <p>Loading student information...</p>
            )} 
            <p style={{color:'red', fontWeight:'bold', textAlign: 'center', marginBottom: '10px'}}>
                *Please tae on the range of 1 to 5
            </p>
            <table className="feedback-table">
                <thead>
                    <tr>
                        <th>Poor</th>
                        <th>Fair</th>
                        <th>Average</th>
                        <th>Good</th>
                        <th>Excellent</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                </tbody>
            </table>

            <div className="selection-container">
                <div className="dropdown-container">
                    <label className="dropdown-label">
                        Select Academic Year:
                        <select
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            className="styled-dropdown"
                            required
                        >
                            <option value="">--Select Academic Year--</option>
                            <option value="2023-24">2023-24</option>
                        </select>
                    </label>
                </div>
                <div className="dropdown-container">
                    <label className="dropdown-label">
                        Select Semester:
                        <select
                            value={semester}
                            onChange={handleSemesterChange}
                            className="styled-dropdown"
                            required
                        >
                            <option value="">--Select Semester--</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="feedback-type-container">
                <h3>Select Feedback Type</h3>
                <div className="feedback-type-selector">
                    <button
                        className={`feedback-type-button ${feedbackType === 'Pre-Feedback' ? 'active pre' : ''}`}
                        onClick={() => handleFeedbackTypeChange('Pre-Feedback')}
                        disabled={!academicYear || !semester || feedbackStatus.preFeedback}
                    >
                        Pre-Feedback {feedbackStatus.preFeedback && '(Submitted)'}
                    </button>
                    <button
                        className={`feedback-type-button ${feedbackType === 'Post-Feedback' ? 'active post' : ''}`}
                        onClick={() => handleFeedbackTypeChange('Post-Feedback')}
                        disabled={!academicYear || !semester || !feedbackStatus.preFeedback || feedbackStatus.postFeedback}
                    >
                        Post-Feedback {feedbackStatus.postFeedback && '(Submitted)'}
                    </button>
                </div>
            </div>

            {feedbackType && (
                <form onSubmit={handleSubmit}>
                    <table className="feedback-table">
                        {renderFacultyHeaders()}
                        {renderQuestions()}
                    </table>
                    <button type="submit" disabled={loading}>
                        {loading ? <ClipLoader size={20} color="#fff" /> : 'Submit Feedback'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default FeedbackForm;