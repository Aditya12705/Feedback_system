const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Course = require('../models/Course');

const authenticateAdmin = (req, res, next) => {
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
};

router.post('/add', authenticateAdmin, async (req, res) => {
    const { studentId, name, password, course } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ studentId, name, password: hashedPassword, role: 'student', course });
        await user.save();
        res.status(201).json({ message: 'Student added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const { semester, course } = req.query;

        if (!semester || !course) {
            return res.status(400).json({ message: 'Missing required query parameters: semester and course.' });
        }

        console.log('Received query params:', { semester, course }); // Debug log

        // Update query to be case-insensitive for course
        const students = await User.find({ 
            role: 'student',
            course: { $regex: new RegExp(course, 'i') },
            semester: semester 
        });

        console.log(`Found ${students.length} students`); // Debug log

        if (!students.length) {
            return res.status(404).json({ message: 'No students found for the given filters.' });
        }

        res.json(students.map(student => ({
            studentId: student.studentId,
            studentName: student.name,
        })));
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: 'Failed to fetch students.' });
    }
});

module.exports = router;