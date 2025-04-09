import React, { useEffect, useState } from 'react';

const StudentInfo = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const response = await fetch('/api/student/info'); // Ensure this matches the backend route
                if (!response.ok) {
                    throw new Error('Failed to fetch student information');
                }
                const data = await response.json();
                setStudentInfo(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStudentInfo();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>Failed to load student info. Please try again.</p>;
    }

    if (!studentInfo) {
        return <p>Loading student information...</p>;
    }

    return (
        <div>
            <h3>Student Information</h3>
            <p>Name: {studentInfo.name}</p>
            <p>USN: {studentInfo.usn}</p>
            <p>Course: {studentInfo.course}</p>
        </div>
    );
};

export default StudentInfo;
