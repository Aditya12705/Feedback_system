const express = require('express');
const db = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to authenticate student
const authenticateStudent = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

router.post('/submit', authenticateStudent, async (req, res) => {
    console.log('Received feedback submission:', JSON.stringify(req.body, null, 2));
    
    try {
        const { feedback } = req.body;
        if (!Array.isArray(feedback)) {
            return res.status(400).json({ message: 'Feedback must be an array' });
        }

        await db.query('START TRANSACTION');
        const studentId = req.user.studentId;

        for (const entry of feedback) {
            const { facultyId, scores, selectedFaculty, comment } = entry;
            
            if (!facultyId || !Array.isArray(scores)) {
                throw new Error(`Invalid feedback entry: ${JSON.stringify(entry)}`);
            }

            // Insert scores with proper error handling
            for (let i = 0; i < scores.length; i++) {
                const score = parseInt(scores[i], 10);
                if (isNaN(score) || score < 1 || score > 5) {
                    await db.query('ROLLBACK');
                    return res.status(400).json({ 
                        message: `Invalid score value: ${scores[i]} at index ${i}`
                    });
                }

                const insertQuery = `
                    INSERT INTO scores 
                    (student_id, faculty_id, question_id, score, selected_faculty, comment, feedbackType)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    score = VALUES(score),
                    selected_faculty = VALUES(selected_faculty),
                    comment = VALUES(comment)`;

                await db.query(insertQuery, [
                    studentId,
                    facultyId,
                    i + 1, // question_id starts from 1
                    score,
                    selectedFaculty || null,
                    comment || '',
                    'Post-Feedback'
                ]);
            }
        }

        await db.query('COMMIT');
        res.json({ 
            success: true, 
            message: 'Feedback submitted successfully',
            count: feedback.length
        });

    } catch (error) {
        console.error('Error in feedback submission:', error);
        await db.query('ROLLBACK');
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
});

module.exports = router;
