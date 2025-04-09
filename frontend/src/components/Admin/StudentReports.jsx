import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/SharedStyles.css';

const StudentReports = () => {
    const [students, setStudents] = useState([]);
    // Removed unused 'course' state
    const [semesters] = useState([1, 2]); // Only 2 semesters
    const [filters, setFilters] = useState({
        course: '',
        semester: '',
    });
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                const response = await axios.get('http://localhost:5000/api/students', {
                    params: { 
                        course: filters.course,
                        semester: filters.semester 
                    },
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                const formattedStudents = response.data.map(student => ({
                    ...student,
                    displayCourse: filters.course.toUpperCase()
                }));
                
                setStudents(formattedStudents);
                setError('');
            } catch (err) {
                console.error('Error fetching students:', err);
                setError(err.response?.data?.message || 'Failed to fetch student data.');
            } finally {
                setLoading(false);
            }
        };

        if (filters.course && filters.semester) {
            fetchStudents();
        }
    }, [filters.course, filters.semester]);

    // Static course options
    const courseOptions = [
        { value: 'b.tech cse', label: 'B.TECH CSE' },
        { value: 'b.tech aiml', label: 'B.TECH AIML' }
    ];

    const viewStudentReport = (studentId) => {
        console.log('Opening report for studentId:', studentId); // Debugging log
        window.open(`/student-report/${studentId}`, '_blank'); // Open the report in a new tab
    };

    const filteredStudents = students.filter(student => 
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <div className="report-header">
                <h1 className="report-title">Student Reports Dashboard</h1>
                <p className="report-subtitle">View and analyze student feedback responses</p>
            </div>

            <div className="filter-section">
                <div className="filter-grid">
                    <div className="filter-item">
                        <label>Course</label>
                        <select
                            name="course"
                            value={filters.course}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            <option value="">All Courses</option>
                            {courseOptions.map((course, index) => (
                                <option key={index} value={course.value}>
                                    {course.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Semester</label>
                        <select
                            name="semester"
                            value={filters.semester}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            <option value="">Select Semester</option>
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Search Students</label>
                        <input
                            type="text"
                            placeholder="Search by USN or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="data-table-container">
                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : filteredStudents.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>USN</th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Semester</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.studentId} className="student-row">
                                    <td>{student.studentId}</td>
                                    <td>{student.studentName}</td>
                                    <td>{student.displayCourse || filters.course.toUpperCase() || '-'}</td>
                                    <td>{filters.semester || '-'}</td>
                                    <td>
                                        <button
                                            onClick={() => viewStudentReport(student.studentId)}
                                            className="action-button primary"
                                        >
                                            View Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data-message">
                        No students found matching the current filters
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentReports;
