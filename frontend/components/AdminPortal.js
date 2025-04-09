import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPortal() {
    const [students, setStudents] = useState([]);
    const [filters, setFilters] = useState({
        usn: '',
        course: '',
        semester: '',
    });
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        const fetchCoursesAndSemesters = async () => {
            try {
                const token = localStorage.getItem('token');
                const coursesResponse = await axios.get('http://localhost:5000/api/courses', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourses(coursesResponse.data.map(course => course.courseName));
                setSemesters([...new Set(coursesResponse.data.map(course => course.semester))]);
            } catch (error) {
                console.error('Error fetching courses and semesters:', error);
            }
        };

        fetchCoursesAndSemesters();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from localStorage
                const response = await axios.get('http://localhost:5000/api/students', {
                    params: { course: filters.course, semester: filters.semester },
                    headers: { Authorization: `Bearer ${token}` }, // Include the token in the request headers
                });
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                alert(error.response?.data?.message || 'Failed to fetch students. Please try again.');
            }
        };

        if (filters.course && filters.semester) {
            fetchStudents();
        }
    }, [filters.course, filters.semester]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const downloadStudentReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/student-report/${filters.usn}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `student_report_${filters.usn}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
            alert(error.response?.data?.message || 'Failed to download student report.');
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>

            {/* Filters Section */}
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Course:
                    <select
                        name="course"
                        value={filters.course}
                        onChange={handleFilterChange}
                        style={{ marginLeft: '10px', marginRight: '20px' }}
                    >
                        <option value="">--Select Course--</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Semester:
                    <select
                        name="semester"
                        value={filters.semester}
                        onChange={handleFilterChange}
                        style={{ marginLeft: '10px', marginRight: '20px' }}
                    >
                        <option value="">--Select Semester--</option>
                        {semesters.map((semester, index) => (
                            <option key={index} value={semester}>
                                {semester}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    USN:
                    <select
                        name="usn"
                        value={filters.usn}
                        onChange={handleFilterChange}
                        style={{ marginLeft: '10px' }}
                    >
                        <option value="">--Select USN--</option>
                        {students.map((student) => (
                            <option key={student.studentId} value={student.studentId}>
                                {student.studentId} - {student.studentName}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Download Report Button */}
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={downloadStudentReport}
                    disabled={!filters.usn}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: filters.usn ? '#007bff' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: filters.usn ? 'pointer' : 'not-allowed',
                    }}
                >
                    Download Student Report
                </button>
            </div>
        </div>
    );
}

export default AdminPortal;