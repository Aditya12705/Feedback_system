import React from 'react';
import axios from 'axios';

function AdminDashboard() {
    const downloadStudentReport = async (studentId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await axios.get(`http://localhost:5000/api/student-report/${studentId}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }, // Include the token in the request headers
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `student_report_${studentId}.pdf`);
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
            <button onClick={() => downloadStudentReport(1)}>Download Student Report</button>
            {/* Replace `1` with the actual student ID */}
        </div>
    );
}

export default AdminDashboard;