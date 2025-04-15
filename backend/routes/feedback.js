const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const db = require('../db'); // Assuming db is the SQL database connection
const excel = require('exceljs'); // Add this at the top

// Middleware to authenticate students
const authenticateStudent = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'student') {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to authenticate admins
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.error('No token provided in Authorization header.');
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debugging log

        if (decoded.role !== 'admin') {
            console.error(`Access denied: User role is not admin. Role: ${decoded.role}`);
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = decoded; // Attach the decoded token to `req.user`
        console.log('Admin user authenticated:', req.user); // Debugging log
        next();
    } catch (err) {
        console.error('Error verifying token:', err); // Debugging log
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Helper function to calculate percentile - place this at the top with other helpers
function calculatePercentile(score, maxScore = 5) {
    if (!score || typeof score !== 'number') return '0';
    return ((score / maxScore) * 100).toFixed(2);
}

// Fetch faculties for a student (with semester param)
router.get('/faculties', authenticateStudent, async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        if (!student || student.role !== 'student') {
            return res.status(403).json({ message: 'Access denied.' });
        }
        // Use semester from query param if provided, else student's current semester
        const semester = req.query.semester ? parseInt(req.query.semester) : student.semester;
        const [results] = await db.query(
            `SELECT f.* 
             FROM faculties f 
             WHERE f.courseName = ? AND f.semester = ?`,
            [student.course.toLowerCase(), semester]
        );

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No faculties found for the specified semester.' });
        }

        const formattedFaculties = results.map(faculty => ({
            id: faculty.id,
            facultyName: faculty.name.trim(),
            subjectName: faculty.subjectName || faculty.subject,
            isElective: Boolean(faculty.isElective),
            semester: semester
        }));

        res.json(formattedFaculties);
    } catch (err) {
        console.error('Faculty fetch error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Fetch faculties with filters for academic year, course, and semester (Admin-specific route)
router.get('/admin/faculties', authenticateAdmin, async (req, res) => {
    try {
        const { academicYear, course, semester, feedbackType } = req.query;

        const [results] = await db.query(
            `SELECT 
                f.id, 
                f.name as facultyName, 
                f.subjectName,
                f.courseName,
                f.isElective,
                COUNT(DISTINCT s.student_id) as totalStudents,
                AVG(CASE WHEN f.isElective = 0 THEN s.score END) as regularScore,
                AVG(CASE 
                    WHEN f.isElective = 1 AND s.selected_faculty = SUBSTRING_INDEX(f.name, '/', 1)
                    THEN s.score 
                END) as firstElectiveScore,
                COUNT(DISTINCT CASE 
                    WHEN f.isElective = 1 AND s.selected_faculty = SUBSTRING_INDEX(f.name, '/', 1)
                    THEN s.student_id 
                END) as firstElectiveStudents,
                AVG(CASE 
                    WHEN f.isElective = 1 AND s.selected_faculty = SUBSTRING_INDEX(f.name, '/', -1)
                    THEN s.score 
                END) as secondElectiveScore,
                COUNT(DISTINCT CASE 
                    WHEN f.isElective = 1 AND s.selected_faculty = SUBSTRING_INDEX(f.name, '/', -1)
                    THEN s.student_id 
                END) as secondElectiveStudents
            FROM faculties f
            LEFT JOIN scores s ON f.id = s.faculty_id AND s.feedbackType = ?
            WHERE f.courseName = ? AND f.semester = ?
            GROUP BY f.id`,
            [feedbackType, course.toLowerCase(), parseInt(semester)]
        );

        const faculties = results.map(faculty => ({
            _id: faculty.id,
            subjectName: faculty.subjectName,
            isElective: Boolean(faculty.isElective),
            totalStudents: faculty.totalStudents || 0,
            firstFaculty: faculty.isElective ? {
                name: faculty.facultyName.split('/')[0].trim(),
                students: faculty.firstElectiveStudents || 0,
                percentile: calculatePercentile(faculty.firstElectiveScore, 5)
            } : null,
            secondFaculty: faculty.isElective ? {
                name: faculty.facultyName.split('/')[1].trim(),
                students: faculty.secondElectiveStudents || 0,
                percentile: calculatePercentile(faculty.secondElectiveScore, 5)
            } : null,
            facultyName: faculty.facultyName,
            percentileScore: faculty.isElective ? null : calculatePercentile(faculty.regularScore, 5)
        }));

        res.json(faculties);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Failed to load faculties' });
    }
});

// Helper function to calculate percentile
function calculatePercentile(score, maxScore) {
    if (!score || score === 0) return 0;
    return ((score / maxScore) * 100).toFixed(2);
}

// Move PDF generation route before the generic faculty route
router.get('/generate-pdf/:facultyId/:electiveFaculty?', authenticateAdmin, async (req, res) => {
    try {
        const { facultyId, electiveFaculty } = req.params;

        // First get the average score
        const [scoreResults] = await db.query(
            `SELECT 
                AVG(s.score) as averageScore,
                COUNT(DISTINCT s.student_id) as totalStudents,
                f.name, f.subjectName, f.courseName, f.semester, f.isElective
             FROM faculties f
             LEFT JOIN scores s ON f.id = s.faculty_id
             ${electiveFaculty ? 'AND s.selected_faculty = ?' : ''}
             WHERE f.id = ?
             GROUP BY f.id`,
            electiveFaculty ? [electiveFaculty, facultyId] : [facultyId]
        );

        if (!scoreResults || scoreResults.length === 0) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const faculty = scoreResults[0];
        const averageScore = parseFloat(faculty.averageScore) || 0;
        const percentileScore = ((averageScore / 5) * 100).toFixed(2);

        // Create PDF document
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=faculty-feedback-${facultyId}${electiveFaculty ? '-' + electiveFaculty : ''}.pdf`);
            res.send(pdfBuffer);
        });

        // Add content to PDF
        doc.fontSize(20).text('Faculty Feedback Report', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12);
        doc.font('Helvetica-Bold').text('Faculty Details', { underline: true });
        doc.font('Helvetica');
        doc.text(`Name: ${electiveFaculty || faculty.name}`);
        doc.text(`Subject: ${faculty.subjectName}`);
        doc.text(`Course: ${faculty.courseName.toUpperCase()}`);
        doc.text(`Semester: ${faculty.semester}`);
        doc.text(`Total Students Responded: ${faculty.totalStudents || 0}`);
        doc.text(`Percentile Score: ${percentileScore}%`);
        doc.moveDown();

        // Get question-wise scores
        const [scores] = await db.query(
            `SELECT 
                q.id as questionId,
                q.text as questionText,
                s.feedbackType,
                AVG(s.score) as avgScore,
                COUNT(DISTINCT s.student_id) as responseCount
            FROM scores s
            JOIN questions q ON s.question_id = q.id
            WHERE s.faculty_id = ?
            ${electiveFaculty ? 'AND s.selected_faculty = ?' : ''}
            GROUP BY q.id, q.text, s.feedbackType
            ORDER BY s.feedbackType, q.id`,
            electiveFaculty ? [facultyId, electiveFaculty] : [facultyId]
        );

        // Add feedback sections
        ['Pre-Feedback', 'Post-Feedback'].forEach(feedbackType => {
            const typeScores = scores.filter(s => s.feedbackType === feedbackType);
            if (typeScores.length > 0) {
                doc.font('Helvetica-Bold').text(`${feedbackType} Results`, { underline: true });
                doc.moveDown();
                
                typeScores.forEach(score => {
                    doc.font('Helvetica');
                    doc.text(`Q: ${score.questionText}`);
                    doc.text(`Avg Score: ${Number(score.avgScore).toFixed(2)} / 5.0 (${score.responseCount} responses)`);
                    doc.moveDown(0.5);
                });
                doc.moveDown();
            }
        });

        doc.end();

    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({ 
            message: 'Failed to generate PDF report',
            error: err.message 
        });
    }
});

// Add new debugging endpoint
router.get('/debug/faculty/:id', authenticateStudent, async (req, res) => {
    try {
        const [[faculty]] = await db.query('SELECT * FROM faculties WHERE id = ?', [req.params.id]);
        res.json({ faculty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new endpoint to check feedback status (per semester)
router.get('/status/:studentId', authenticateStudent, async (req, res) => {
    try {
        const semester = req.query.semester ? parseInt(req.query.semester) : null;
        let query = `SELECT DISTINCT feedbackType, COUNT(*) as count 
                     FROM scores 
                     WHERE student_id = ?`;
        const params = [req.params.studentId];
        if (semester) {
            query += ' AND semester = ?';
            params.push(semester);
        }
        query += ' GROUP BY feedbackType';
        const [results] = await db.query(query, params);
        const status = {
            preFeedback: Boolean(results.find(r => r.feedbackType === 'Pre-Feedback' && r.count > 0)),
            postFeedback: Boolean(results.find(r => r.feedbackType === 'Post-Feedback' && r.count > 0))
        };
        res.json(status);
    } catch (error) {
        console.error('Error checking feedback status:', error);
        res.status(500).json({ message: 'Error checking feedback status' });
    }
});

// Submit feedback (store semester from payload)
router.post('/submit', authenticateStudent, async (req, res) => {
    try {
        const { feedback, feedbackType, semester } = req.body;
        const studentId = req.user.studentId;

        // Validate semester
        if (!semester) {
            return res.status(400).json({
                success: false,
                message: 'Semester is required'
            });
        }

        console.log('Submitting feedback:', {
            studentId,
            feedbackType,
            semester,
            feedbackCount: feedback.length
        });

        // Check for duplicate submission for this semester
        const [[existing]] = await db.query(
            `SELECT COUNT(*) as count FROM scores 
             WHERE student_id = ? AND feedbackType = ? AND semester = ?`,
            [studentId, feedbackType, semester]
        );

        if (existing.count > 0) {
            return res.status(400).json({
                success: false,
                message: `${feedbackType} has already been submitted for Semester ${semester}`
            });
        }

        // Insert feedback scores with semester
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
                        selectedFaculty, comment || '', feedbackType, semester
                    ]
                );
            }
        }

        res.json({ 
            success: true, 
            message: `${feedbackType} submitted successfully for Semester ${semester}` 
        });

    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit feedback',
            error: error.message 
        });
    }
});

// Get feedback data for admin view
router.get('/admin/feedback', authenticateAdmin, async (req, res) => {
    try {
        const { semester, course } = req.query;
        console.log('Admin feedback request:', { semester, course });

        // Get all feedback data with exact semester matching
        const query = `
            SELECT DISTINCT
                s.student_id, 
                st.name as student_name, 
                s.faculty_id,
                s.semester as feedback_semester,
                s.feedbackType,
                s.score,
                s.question_id,
                s.selected_faculty,
                s.comment,
                f.name as faculty_name,
                f.subjectName,
                f.courseName,
                q.text as question_text
            FROM scores s
            JOIN students st ON s.student_id = st.student_id
            JOIN faculties f ON s.faculty_id = f.id
            JOIN questions q ON s.question_id = q.id
            WHERE st.course = ? 
            AND s.semester = ?
            ORDER BY s.student_id, s.feedbackType, f.id, s.question_id`;

        const [results] = await db.query(query, [course.toLowerCase(), parseInt(semester)]);
        
        console.log(`Found ${results.length} records for semester ${semester}`);

        const formattedData = results.reduce((acc, row) => {
            const key = row.student_id;
            if (!acc[key]) {
                acc[key] = {
                    studentId: row.student_id,
                    studentName: row.student_name,
                    semester: parseInt(row.feedback_semester), // Convert to number
                    course: row.courseName,
                    feedbacks: []
                };
            }

            // Find or create feedback entry
            let feedback = acc[key].feedbacks.find(f => 
                f.facultyId === row.faculty_id && 
                f.feedbackType === row.feedbackType
            );

            if (!feedback) {
                feedback = {
                    facultyId: row.faculty_id,
                    facultyName: row.selected_faculty || row.faculty_name,
                    subjectName: row.subjectName,
                    feedbackType: row.feedbackType,
                    scores: [],
                    comment: row.comment
                };
                acc[key].feedbacks.push(feedback);
            }

            feedback.scores.push({
                questionId: row.question_id,
                questionText: row.question_text,
                score: row.score
            });

            return acc;
        }, {});

        res.json({
            success: true,
            data: Object.values(formattedData)
        });

    } catch (error) {
        console.error('Admin feedback fetch error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Fetch questions for feedback type
router.get('/questions/:feedbackType', authenticateStudent, async (req, res) => {
    try {
        const feedbackType = req.params.feedbackType;
        const selectedSemester = parseInt(req.query.semester) || 1;
        const studentId = req.user.studentId;

        const [[studentInfo]] = await db.query(
            'SELECT * FROM students WHERE student_id = ?',
            [studentId]
        );

        console.log('Loading questions for:', {
            feedbackType,
            semester: selectedSemester,
            course: studentInfo.course
        });

        // Get questions for the specific semester and feedback type
        const [questions] = await db.query(
            `SELECT DISTINCT q.* 
             FROM questions q 
             WHERE q.feedbackType = ?
             ORDER BY q.id ASC`,
            [feedbackType]
        );

        // If no questions found, load from JSON
        if (!questions || questions.length === 0) {
            const questionsPath = path.join(__dirname, '../feedbackSystem.questions.json');
            const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
            const feedbackSection = questionsData.find(
                section => section.feedbackType === feedbackType
            );

            if (!feedbackSection) {
                return res.status(404).json({ message: 'No questions found' });
            }

            return res.json(feedbackSection.questions);
        }

        const questionTexts = questions.map(q => q.text);
        res.json(questionTexts);

    } catch (err) {
        console.error('Questions fetch error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Clear all feedback data
router.delete('/clear', authenticateAdmin, async (req, res) => {
    try {
        await Feedback.deleteMany({});
        res.status(200).json({ message: 'All feedback data cleared successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to clear feedback data.' });
    }
});

// Clear feedback data for a specific student
router.post('/clear-feedback/:studentId', authenticateStudent, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        await db.query(
            'DELETE FROM scores WHERE student_id = ?',
            [studentId]
        );
        
        res.json({ success: true, message: 'Feedback data cleared successfully' });
    } catch (error) {
        console.error('Error clearing feedback:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to clear feedback data',
            error: error.message 
        });
    }
});

// Fetch feedback for a specific faculty
router.get('/:facultyId', authenticateAdmin, async (req, res) => {
    try {
        const facultyId = req.params.facultyId;
        const feedback = await Feedback.find({ facultyId });
        if (!feedback.length) {
            return res.status(404).json({ message: 'No feedback found for this faculty.' });
        }
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch feedback for the faculty.' });
    }
});

// Generate feedback report
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        console.log('Generating feedback report...');

        const feedback = await Feedback.aggregate([
            {
                $group: {
                    _id: '$facultyId',
                    facultyName: { $first: '$facultyName' },
                    subjectName: { $first: '$subjectName' },
                    averageScore: { $avg: { $ifNull: ['$averageScore', 0] } }, // Handle missing averageScore
                    scores: { $push: { $ifNull: ['$scores', []] } }, // Handle missing scores
                    comments: { $push: { $ifNull: ['$comment', 'No comment'] } }, // Handle missing comments
                },
            },
            {
                $project: {
                    facultyId: '$_id',
                    facultyName: 1,
                    subjectName: 1,
                    averageScore: 1,
                    scores: 1,
                    comments: 1,
                    _id: 0,
                },
            },
        ]);

        console.log('Feedback report generated successfully:', feedback);
        res.json(feedback);
    } catch (err) {
        console.error('Error generating feedback report:', err);
        res.status(500).json({ message: 'Failed to generate feedback report.' });
    }
});

// Get faculty feedback data in Excel format
router.get('/faculty-feedback-excel/:facultyId/:electiveFaculty?', authenticateAdmin, async (req, res) => {
    try {
        const { facultyId, electiveFaculty } = req.params;

        // Modify the query to filter by selected faculty for electives
        const whereClause = electiveFaculty ? 
            'AND s.selected_faculty = ?' : '';
        const queryParams = electiveFaculty ? 
            [facultyId, electiveFaculty] : [facultyId];

        const [scores] = await db.query(
            `SELECT 
                s.student_id,
                GROUP_CONCAT(s.score ORDER BY s.question_id) as scores
            FROM scores s
            WHERE s.faculty_id = ? ${whereClause}
            GROUP BY s.student_id`,
            queryParams
        );

        const excelData = scores.map(row => {
            const scoreArray = row.scores.split(',');
            const data = { 'Student ID': row.student_id };
            scoreArray.forEach((score, index) => {
                data[`Q${index + 1}`] = parseInt(score);
            });
            return data;
        });

        res.json(excelData);
    } catch (err) {
        res.status(500).json({ message: 'Failed to generate Excel data' });
    }
});

router.get('/faculty/:facultyId/excel', authenticateAdmin, async (req, res) => {
    try {
        const { facultyId } = req.params;
        
        // Get all scores grouped by student
        const [results] = await db.query(
            `SELECT 
                s.student_id,
                s.question_id,
                s.score
             FROM scores s
             WHERE s.faculty_id = ?
             ORDER BY s.student_id, s.question_id`,
            [facultyId]
        );

        // Process the data into the required format
        const studentScores = {};
        results.forEach(row => {
            if (!studentScores[row.student_id]) {
                studentScores[row.student_id] = new Array(26).fill(null);
            }
            // Adjust index to be 0-based for array
            const questionIndex = (row.question_id % 100) - 1;
            if (questionIndex >= 0 && questionIndex < 26) {
                studentScores[row.student_id][questionIndex] = row.score;
            }
        });

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Feedback');

        // Add headers
        const headers = ['Student ID'];
        for (let i = 1; i <= 26; i++) {
            headers.push(`Q${i}`);
        }
        worksheet.columns = headers.map(header => ({ header, key: header }));

        // Add data rows
        Object.entries(studentScores).forEach(([studentId, scores]) => {
            const row = { 'Student ID': studentId };
            scores.forEach((score, index) => {
                row[`Q${index + 1}`] = score || 0; // Replace null with 0
            });
            worksheet.addRow(row);
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=faculty_feedback_${facultyId}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error generating excel:', error);
        res.status(500).json({ message: 'Failed to generate excel file' });
    }
});

// Update the student report query
router.get('/student/:studentId', authenticateAdmin, async (req, res) => {
    try {
        const semester = req.query.semester ? parseInt(req.query.semester) : null;
        const params = [req.params.studentId];
        let semesterFilter = '';
        if (semester) {
            semesterFilter = ' AND s.semester = ?';
            params.push(semester);
        }
        const [results] = await db.query(
            `SELECT s.*, 
                    q.text as question_text, 
                    f.name as faculty_name,
                    f.subjectName, 
                    st.course, 
                    st.name as student_name,
                    st.studentId as usn,
                    s.semester
             FROM scores s
             JOIN students st ON s.student_id = st.student_id
             JOIN questions q ON s.question_id = q.id
             JOIN faculties f ON s.faculty_id = f.id
             WHERE s.student_id = ?${semesterFilter}
             ORDER BY s.semester, s.feedbackType, f.id, q.id`,
            params
        );

        if (!results || results.length === 0) {
            return res.json({ feedback: [] });
        }

        // Group and structure the data for the frontend
        const studentInfo = {
            name: results[0].student_name,
            usn: results[0].usn,
            course: results[0].course,
            semester: results[0].semester
        };

        // Group feedback by faculty and feedback type
        const feedbackMap = {};
        results.forEach(row => {
            const facultyKey = `${row.selected_faculty || row.faculty_name} - ${row.subjectName}`;
            if (!feedbackMap[facultyKey]) feedbackMap[facultyKey] = [];
            feedbackMap[facultyKey].push({
                question: row.question_text,
                score: row.score,
                comment: row.comment,
                feedbackType: row.feedbackType,
                questionId: row.question_id
            });
        });

        res.json({
            ...studentInfo,
            feedback: Object.entries(feedbackMap).map(([facultyDetails, feedbackItems]) => ({
                facultyDetails,
                feedbackItems: feedbackItems.sort((a, b) => a.questionId - b.questionId)
            }))
        });
    } catch (error) {
        console.error('Error fetching student feedback:', error);
        res.status(500).json({ message: 'Failed to fetch student feedback' });
    }
});

module.exports = router;