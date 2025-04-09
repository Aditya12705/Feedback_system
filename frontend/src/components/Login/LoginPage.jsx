import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Footer from '../Footer/Footer'; // Import the Footer component

const LoginPage = () => {
    const [usn, setUsn] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!usn || !password) {
            setError('USN and password are required.');
            return;
        }

        try {
            console.log('Sending login request with:', { usn, password }); // Debugging log
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                usn, // Use `usn` in the request body
                password,
            });
            console.log('Token received:', response.data.token); // Debugging log
            localStorage.setItem('token', response.data.token); // Store token in localStorage
            console.log('Token stored in localStorage:', localStorage.getItem('token')); // Debugging log
            navigate('/dashboard'); // Redirect to the dashboard after successful login
        } catch (err) {
            console.error('Error during login:', err);
            setError(err.response?.data?.message || 'Failed to login. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="usn">USN</label>
                    <input
                        type="text"
                        id="usn"
                        value={usn}
                        onChange={(e) => setUsn(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <Footer /> {/* Add the Footer component */}
        </div>
    );
};

export default LoginPage;
