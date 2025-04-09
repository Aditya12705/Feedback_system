import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';
import '../../styles/SharedStyles.css';

const Admin = () => {
    const [faculties, setFaculties] = useState([]);
    const [academicYear, setAcademicYear] = useState('');
    const [course, setCourse] = useState('');
    const [semester, setSemester] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [error, setError] = useState('');

    const fetchFaculties = async () => {
        try {
            if (!academicYear || !course || !semester || !feedbackType) {
                setError('Please select all filters before fetching data');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token is missing. Please log in again.');
                return;
            }

            console.log('Fetching faculties with params:', { academicYear, course, semester, feedbackType });
            
            const response = await axios.get('http://localhost:5000/api/feedback/admin/faculties', {
                headers: { Authorization: `Bearer ${token}` },
                params: { 
                    academicYear: academicYear,
                    course: course.toLowerCase(),
                    semester: parseInt(semester),
                    feedbackType: feedbackType
                }
            });

            response.data.forEach(faculty => {
                if (faculty.isElective) {
                    console.log('Elective Faculty Data:', {
                        subject: faculty.subjectName,
                        first: {
                            name: faculty.firstFaculty?.name,
                            students: faculty.firstFaculty?.students,
                            percentile: faculty.firstFaculty?.percentile,
                            score: faculty.firstFaculty?.score,
                        },
                        second: {
                            name: faculty.secondFaculty?.name,
                            students: faculty.secondFaculty?.students,
                            percentile: faculty.secondFaculty?.percentile,
                            score: faculty.secondFaculty?.score,
                        }
                    });
                } else {
                    console.log('Regular Faculty Data:', {
                        subject: faculty.subjectName,
                        name: faculty.facultyName,
                        students: faculty.totalStudents,
                        percentile: faculty.percentileScore,
                        score: faculty.regularScore
                    });
                }
            });

            setFaculties(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching faculties:', err);
            setError(err.response?.data?.message || 'Failed to load faculties. Please try again.');
            setFaculties([]);
        }
    };

    const handleDownload = async (facultyId, electiveFaculty = null) => {
        try {
            const token = localStorage.getItem('token');
            const url = electiveFaculty ? 
                `http://localhost:5000/api/feedback/generate-pdf/${facultyId}/${encodeURIComponent(electiveFaculty)}` :
                `http://localhost:5000/api/feedback/generate-pdf/${facultyId}`;

            const response = await axios.get(url, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` },
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `feedback-report-${facultyId}${electiveFaculty ? '-' + electiveFaculty : ''}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error downloading PDF:', err);
            setError('Failed to download PDF report.');
        }
    };

    const downloadExcel = async (facultyId, electiveFaculty = null) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = 'http://localhost:5000/api/feedback';
            const endpoint = electiveFaculty ? 
                `${baseUrl}/faculty/${facultyId}/excel/${encodeURIComponent(electiveFaculty)}` :
                `${baseUrl}/faculty/${facultyId}/excel`;

            const response = await axios.get(endpoint, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `faculty_feedback_${facultyId}${electiveFaculty ? '_' + electiveFaculty : ''}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading excel:', error);
            setError('Failed to download Excel file');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="report-header">
                <h1 className="report-title">Faculty Reports Dashboard</h1>
                <p className="report-subtitle">View and analyze faculty feedback data</p>
            </div>

            <div className="filter-section">
                <div className="filter-grid">
                    <div className="filter-item">
                        <label>Academic Year</label>
                        <select 
                            value={academicYear} 
                            onChange={(e) => setAcademicYear(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Select Year</option>
                            <option value="2023-24">2023-24</option>
                            <option value="2022-23">2022-23</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Course</label>
                        <select 
                            value={course} 
                            onChange={(e) => setCourse(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Select Course</option>
                            <option value="b.tech cse">B.Tech CSE</option>
                            <option value="b.tech aiml">B.Tech AIML</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Semester</label>
                        <select 
                            value={semester} 
                            onChange={(e) => setSemester(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Select Semester</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Feedback Type</label>
                        <select 
                            value={feedbackType} 
                            onChange={(e) => setFeedbackType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Select Type</option>
                            <option value="Pre-Feedback">Pre-Feedback</option>
                            <option value="Post-Feedback">Post-Feedback</option>
                        </select>
                    </div>
                </div>

                <button 
                    onClick={fetchFaculties}
                    className="action-button primary"
                    disabled={!academicYear || !course || !semester || !feedbackType}
                >
                    Generate Report
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {faculties.length > 0 && (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Faculty</th>
                                <th>Students</th>
                                <th>Percentile</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculties.map((faculty) => 
                                faculty.isElective ? (
                                    <React.Fragment key={faculty._id}>
                                        <tr className="elective-row">
                                            <td rowSpan="2">{faculty.subjectName}</td>
                                            <td>{faculty.firstFaculty?.name}</td>
                                            <td>{faculty.firstFaculty?.students}</td>
                                            <td>
                                                <span className="percentile-badge">
                                                    {faculty.firstFaculty?.percentile ? 
                                                        `${faculty.firstFaculty.percentile}%` : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="action-cell">
                                                <button 
                                                    onClick={() => handleDownload(faculty._id, faculty.firstFaculty?.name)}
                                                    className="action-button secondary"
                                                >
                                                    PDF
                                                </button>
                                                <button 
                                                    onClick={() => downloadExcel(faculty._id, faculty.firstFaculty?.name)}
                                                    className="action-button secondary"
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    Excel
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="elective-row">
                                            <td>{faculty.secondFaculty?.name}</td>
                                            <td>{faculty.secondFaculty?.students}</td>
                                            <td>
                                                <span className="percentile-badge">
                                                    {faculty.secondFaculty?.percentile ? 
                                                        `${faculty.secondFaculty.percentile}%` : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="action-cell">
                                                <button 
                                                    onClick={() => handleDownload(faculty._id, faculty.secondFaculty?.name)}
                                                    className="action-button secondary"
                                                >
                                                    PDF
                                                </button>
                                                <button 
                                                    onClick={() => downloadExcel(faculty._id, faculty.secondFaculty?.name)}
                                                    className="action-button secondary"
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    Excel
                                                </button>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ) : (
                                    <tr key={faculty._id}>
                                        <td>{faculty.subjectName}</td>
                                        <td>{faculty.facultyName}</td>
                                        <td>{faculty.totalStudents}</td>
                                        <td>
                                            <span className="percentile-badge">
                                                {faculty.percentileScore ? `${faculty.percentileScore}%` : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="action-cell">
                                            <button 
                                                onClick={() => handleDownload(faculty._id)}
                                                className="action-button secondary"
                                                title="Download PDF Report"
                                            >
                                                PDF
                                            </button>
                                            <button 
                                                onClick={() => downloadExcel(faculty._id)}
                                                className="action-button secondary"
                                                style={{ marginLeft: '8px' }}
                                                title="Download Excel Report"
                                            >
                                                Excel
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;