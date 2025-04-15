const express = require('express');
const db = require('../services/db'); // Assuming db is the database service
const router = express.Router();

router.get('/students', async (req, res) => {
    const { semester, course } = req.query;

    if (!semester || !course) {
        return res.status(400).json({ message: 'Missing required query parameters: semester or course.' });
    }

    try {
        console.log('Received query params:', { semester, course }); // Debug log

        const [students] = await db.query(
            `SELECT studentId, name, course, semester 
             FROM students 
             WHERE LOWER(course) = ? AND semester = ?`, // Ensure case-insensitive match for course
            [course.toLowerCase(), semester] // Convert course to lowercase for comparison
        );

        console.log(`Found ${students.length} students`); // Debug log

        if (!students.length) {
            return res.status(404).json({ message: 'No students found for the given filters.' });
        }

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
