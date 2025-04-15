const express = require('express');
const { getStudentReportData, debugDatabaseState, clearAllFeedback } = require('../services/reportService');
const router = express.Router();

router.get('/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { semester } = req.query; // Get semester from query params

    try {
        const reportData = await getStudentReportData(studentId, semester); // Pass semester to service
        res.json(reportData);
    } catch (error) {
        console.error('Error generating student report:', error);
        res.status(500).json({ 
            message: 'Error generating report',
            error: error.message,
        });
    }
});

// Add new endpoint to clear feedback
router.post('/clear-feedback', async (req, res) => {
    try {
        await clearAllFeedback();
        res.json({ message: 'All feedback data cleared successfully' });
    } catch (error) {
        console.error('Error clearing feedback:', error);
        res.status(500).json({ 
            message: 'Error clearing feedback',
            error: error.message
        });
    }
});

module.exports = router;
