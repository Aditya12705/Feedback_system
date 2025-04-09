import React from 'react';
import axios from 'axios';

const downloadPDF = async (facultyId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/feedback/generate-pdf/${facultyId}`, {
            responseType: 'blob', // Ensure the response is treated as a file
            headers: { Authorization: `Bearer ${token}` },
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));       
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `feedback-report-${facultyId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the DOM
    } catch (err) {
        console.error('Error downloading PDF:', err);
        alert('Failed to download PDF report.');
    }
};

const FeedbackReport = () => {
    const handleDownload = () => {
        const facultyId = prompt('Enter Faculty ID to download the report:');
        if (facultyId) {
            downloadPDF(facultyId);
        }
    };

    return (
        <div>
            <button onClick={handleDownload}>Download Feedback Report</button>
        </div>
    );
};

export default FeedbackReport;
