const express = require('express');
const cors = require('cors');
const app = express();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-student-id'
    ],
    credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Import routes
const studentReportsRouter = require('./api/studentReports');
const generateStudentReportRouter = require('./api/generateStudentReport');

// Use routes
app.use('/api/studentReports', studentReportsRouter);
app.use('/api/generateStudentReport', generateStudentReportRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});