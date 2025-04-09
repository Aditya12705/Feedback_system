import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedbackSubmitted.css';

const FeedbackSubmitted = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all feedback related data
        const studentId = localStorage.getItem('usn');
        localStorage.removeItem('feedbackSubmitted');
        localStorage.removeItem(`feedbackSubmitted_${studentId}`);
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="submitted-container">
            <h2>Thank You for Your Feedback!</h2>
            <p>Your feedback has been successfully submitted.</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => navigate('/feedback')} style={{ marginTop: '10px' }}>
                Return to Feedback Form
            </button>
        </div>
    );
};

export default FeedbackSubmitted;