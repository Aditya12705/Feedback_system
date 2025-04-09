const express = require('express');
const { getStudentReportData, debugDatabaseState, clearAllFeedback } = require('../services/reportService');
const router = express.Router();

router.get('/:studentId', async (req, res) => {
    const { studentId } = req.params;
    console.log('Received request for student report:', studentId);

    try {
        // Debug database state first
        await debugDatabaseState(studentId);
        
        const reportData = await getStudentReportData(studentId);
        
        // Add debugging information to response in development
        const debugInfo = process.env.NODE_ENV === 'development' ? {
            debug: {
                timestamp: new Date().toISOString(),
                studentId,
                feedbackCount: reportData.feedback ? reportData.feedback.length : 0
            }
        } : {};

        res.json({
            ...reportData,
            ...debugInfo
        });
    } catch (error) {
        console.error('Error generating student report:', error);
        res.status(500).json({ 
            message: 'Error generating report',
            error: error.message,
            studentId
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
