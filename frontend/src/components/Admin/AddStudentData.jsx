import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './AddStudentData.css';

const AddStudentData = () => {
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/students/add',
                { studentId, name, password },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Student added successfully!');
            setStudentId('');
            setName('');
            setPassword('');
        } catch (err) {
            setError('Failed to add student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-student-container">
            <h2>Add Student Data</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="studentId">Student ID</label>
                    <input
                        type="text"
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                <button type="submit" disabled={loading}>
                    {loading ? <ClipLoader size={20} color="#fff" /> : 'Add Student'}
                </button>
            </form>
        </div>
    );
};

export default AddStudentData;