const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

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
    const { courseName, facultyName, subjectName, semester, isElective } = req.body; // Include subjectName

    try {
        const course = new Course({
            courseName,
            facultyName,
            subjectName, // Add subjectName
            semester,
            isElective,
        });
        await course.save();
        res.status(201).json({ message: 'Course added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;