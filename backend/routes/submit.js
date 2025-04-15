const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateStudent = require('../middleware/authenticateStudent');

router.post('/submit', authenticateStudent, async (req, res) => {
    try {
        const { feedback, feedbackType, semester } = req.body;
        const studentId = req.user.studentId;

        // Format semester consistently
        const semesterValue = semester.toString();

        // Insert feedback scores with consistent semester format
        for (const entry of feedback) {
            const { facultyId, scores, selectedFaculty, comment } = entry;
            
            for (let i = 0; i < scores.length; i++) {
                const questionId = feedbackType === 'Pre-Feedback' ? i + 1 : i + 101;
                await db.query(
                    `INSERT INTO scores (
                        student_id, faculty_id, question_id, score, 
                        selected_faculty, comment, feedbackType, semester
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        studentId, facultyId, questionId, scores[i], 
                        selectedFaculty || null,
                        comment || '',
                        feedbackType,
                        semesterValue // Use consistent semester format
                    ]
                );
            }
        }

        res.json({ 
            success: true, 
            message: `${feedbackType} submitted successfully for semester ${semesterValue}`
        });

    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;