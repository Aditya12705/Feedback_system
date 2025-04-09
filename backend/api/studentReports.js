const express = require('express');
const { getFilteredStudentReports } = require('../services/reportService');
const router = express.Router();

router.get('/students', async (req, res) => {
    const { semester, academicYear, course } = req.query;

    if (!semester || !academicYear || !course) {
        return res.status(400).json({ message: 'Missing required query parameters: semester, academicYear, or course.' });
    }

    try {
        const students = await getFilteredStudentReports(semester, academicYear, course);
        if (!students.length) {
            return res.status(404).json({ message: 'No students found for the given filters.' });
        }
        res.json(students);
    } catch (error) {
        console.error('Error fetching filtered students:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
