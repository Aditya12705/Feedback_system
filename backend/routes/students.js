const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

// GET /api/students?course=...&semester=...
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const { course, semester } = req.query;
        if (!course || !semester) {
            return res.status(400).json({ message: 'Course and semester are required' });
        }
        // Only students who have feedback in scores for this course and semester
        const [results] = await db.query(
            `SELECT DISTINCT st.studentId, st.name as studentName, st.course, st.semester
             FROM students st
             INNER JOIN scores sc ON st.studentId = sc.student_id
             WHERE st.course = ? AND sc.semester = ?
             ORDER BY st.studentId`,
            [course, parseInt(semester)]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;