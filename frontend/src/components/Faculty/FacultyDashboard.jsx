import React, { useState } from 'react';
import '../../styles/SharedStyles.css';

const FacultyDashboard = () => {
    const [facultyData] = useState({
        name: 'Dr. John Doe',
        department: 'Computer Science',
        courses: [
            { id: 1, name: 'Data Structures', code: 'CS201', semester: 3, students: 60 },
            { id: 2, name: 'Algorithm Analysis', code: 'CS302', semester: 5, students: 55 }
        ]
    });

    const stats = [
        { label: 'Total Students', value: 115 },
        { label: 'Average Rating', value: '4.5/5' },
        { label: 'Feedback Response', value: '92%' },
        { label: 'Active Courses', value: '2' }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Faculty Dashboard</h1>
                <p className="dashboard-subtitle">Welcome back, {facultyData.name}</p>
            </div>

            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {stats.map((stat, index) => (
                    <div key={index} className="stats-card">
                        <div className="stats-number">{stat.value}</div>
                        <div className="stats-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="dashboard-card" style={{ marginTop: '2rem' }}>
                <h2 className="dashboard-card-header">Current Courses</h2>
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Semester</th>
                            <th>Students</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facultyData.courses.map(course => (
                            <tr key={course.id}>
                                <td>{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.semester}</td>
                                <td>{course.students}</td>
                                <td>
                                    <button className="dashboard-button">View Feedback</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacultyDashboard;
