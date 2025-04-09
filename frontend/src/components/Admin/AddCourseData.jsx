import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './AddCourseData.css';

const AddCourseData = () => {
    const [courseName, setCourseName] = useState('');
    const [facultyName, setFacultyName] = useState('');
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
                'http://localhost:5000/api/courses/add',
                { courseName, facultyName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Course added successfully!');
            setCourseName('');
            setFacultyName('');
        } catch (err) {
            setError('Failed to add course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-course-container">
            <h2>Add Course Data</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseName">Course Name</label>
                    <input
                        type="text"
                        id="courseName"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="facultyName">Faculty Name</label>
                    <input
                        type="text"
                        id="facultyName"
                        value={facultyName}
                        onChange={(e) => setFacultyName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? <ClipLoader size={20} color="#fff" /> : 'Add Course'}
                </button>
            </form>
        </div>
    );
};

export default AddCourseData;