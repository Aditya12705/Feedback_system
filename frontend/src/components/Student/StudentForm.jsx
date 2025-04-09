import React, { useState, useEffect } from 'react';
import './StudentForm.css';

const StudentForm = () => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        console.log("StudentForm component mounted");
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="student-form-container">
            <h2>Student Feedback Form</h2>

            {/* Student details section */}
            <div className="student-details">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>USN:</strong> 123456</p>
                <p><strong>Course:</strong> B.Tech CSE</p>
            </div>

            {/* Feedback table */}
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

            <form onSubmit={handleSubmit}>
                <label>
                    Feedback:
                    <textarea name="feedback" onChange={handleInputChange}></textarea>
                </label>
                <button type="submit">Submit Feedback</button>
            </form>
        </div>
    );
};

export default StudentForm;
