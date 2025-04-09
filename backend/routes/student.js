const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateStudent = require('../middleware/authenticateStudent'); // Fix import path

router.get('/info', authenticateStudent, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'Invalid user token.' });
        }

        const student = await User.findById(req.user.id).select('name studentId course semester'); // Include semester
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            name: student.name,
            studentId: student.studentId, // Fix key to match frontend expectation
            course: student.course.toUpperCase(), // Convert course to uppercase
            semester: student.semester, // Include semester in response
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch student info' });
    }
});

router.get('/student-info', async (req, res) => {
    try {
        const studentId = req.query.studentId; // Assume studentId is passed as a query parameter
        const student = await User.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student information' });
    }
});

module.exports = router;
