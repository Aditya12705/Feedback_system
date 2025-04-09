import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './FeedbackLogin.css';

const FeedbackLogin = ({ onLogin }) => {
    const [usn, setUsn] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usn || !password) {
            setError('Please enter both USN and password.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            console.log('Sending login request with:', { usn, password });
            const response = await axios.post('http://localhost:5000/api/auth/login', { usn, password }); // Ensure 'usn' and 'password' are sent
            const user = response.data;

            // Store the token in localStorage
            localStorage.setItem('token', user.token);
            console.log('Token stored in localStorage:', localStorage.getItem('token')); // Debugging log

            if (user.role === 'student') {
                localStorage.setItem('usn', usn);
                localStorage.setItem('studentCourse', user.course);
                localStorage.setItem('role', 'student');
                localStorage.setItem('name', user.name);

                const feedbackSubmitted = localStorage.getItem(`feedbackSubmitted_${usn}`);
                if (feedbackSubmitted === 'true') {
                    navigate('/feedback-submitted');
                    return;
                }

                setSuccessMessage('Login successful! Redirecting to feedback form...');
                setIsSubmitted(true);
                setTimeout(() => navigate('/feedback'), 1000);
                if (typeof onLogin === 'function') onLogin(user);
            } else if (user.role === 'admin') {
                setSuccessMessage('Admin login successful!');
                setTimeout(() => navigate('/admin'), 1000);
            } else {
                setError('Invalid role. Please contact support.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            if (err.response) {
                setError(err.response.data?.message || 'Invalid credentials. Please try again.');
            } else if (err.request) {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setError('');
        setSuccessMessage('');
        setIsSubmitted(false);
        handleSubmit({ preventDefault: () => {} });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="login-title">Faculty FeedBack Form</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                    Login to share your feedback
                </p>
                {error && (
                    <div className="error-message">
                        {error}
                        {error.includes('Network error') && (
                            <button
                                type="button"
                                onClick={handleRetry}
                                style={{
                                    marginLeft: '10px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#003087',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                }}
                            >
                                Retry
                            </button>
                        )}
                    </div>
                )}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <label htmlFor="usn" className="sr-only">USN</label>
                <input
                    id="usn"
                    type="text"
                    placeholder="Enter USN"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value.trim())}
                    className="login-input"
                    disabled={loading || isSubmitted}
                    aria-required="true"
                />
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    disabled={loading || isSubmitted}
                    aria-required="true"
                />
                <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                    <button
                        type="button"
                        onClick={() => alert('Please contact the administrator to reset your password.')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#003087',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '12px',
                        }}
                    >
                        Forgot Password?
                    </button>
                </div>
                <button
                    type="submit"
                    className="login-button"
                    disabled={loading || isSubmitted}
                >
                    {loading ? (
                        <ClipLoader size={20} color="#ffffff" />
                    ) : isSubmitted ? (
                        'Success'
                    ) : (
                        'Proceed to Feedback'
                    )}
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="login-button"
                    style={{ marginTop: '10px', backgroundColor: '#dc3545' }}
                >
                    Logout
                </button>
            </form>
        </div>
    );
};

FeedbackLogin.propTypes = {
    onLogin: PropTypes.func,
};

FeedbackLogin.defaultProps = {
    onLogin: () => {},
};

export default FeedbackLogin;