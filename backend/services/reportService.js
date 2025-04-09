const db = require('../db');

async function clearAllFeedback() {
    try {
        console.log('Clearing all feedback data...');
        await db.query('DELETE FROM scores');
        console.log('All feedback data cleared successfully');
        return true;
    } catch (error) {
        console.error('Error clearing feedback:', error);
        throw error;
    }
}

async function getStudentReportData(studentId) {
    try {
        // Get student info
        const [[student]] = await db.query(
            `SELECT name, studentId, course, semester FROM students WHERE student_id = ?`,
            [studentId]
        );

        if (!student) {
            throw new Error('Student not found');
        }

        const [feedbackData] = await db.query(
            `SELECT 
                s.score,
                s.comment,
                s.feedbackType,
                s.question_id as questionId,
                s.selected_faculty,
                f.name as faculty_name,
                f.subjectName,
                q.text as question,
                f.id as facultyId,
                f.isElective
            FROM 
                scores s
                INNER JOIN faculties f ON s.faculty_id = f.id
                INNER JOIN questions q ON s.question_id = q.id
            WHERE 
                s.student_id = ?
            ORDER BY 
                s.feedbackType ASC,
                f.id ASC,
                s.question_id ASC`,
            [studentId]
        );

        // Process feedback data
        const processedFeedback = {};
        
        feedbackData.forEach(item => {
            // Use selected_faculty for electives, otherwise use faculty_name
            const facultyName = item.isElective ? item.selected_faculty : item.faculty_name;
            const facultyKey = `${facultyName} - ${item.subjectName}`;
            
            if (!processedFeedback[facultyKey]) {
                processedFeedback[facultyKey] = [];
            }

            processedFeedback[facultyKey].push({
                question: item.question,
                score: parseInt(item.score),
                comment: item.comment || '',
                feedbackType: item.feedbackType,
                questionId: item.questionId
            });
        });

        // Debug logging
        console.log('Raw feedback data:', feedbackData);
        console.log('Processed feedback:', processedFeedback);

        return {
            studentName: student.name,
            usn: student.studentId,
            course: student.course,
            semester: student.semester,
            feedback: Object.entries(processedFeedback).map(([key, items]) => ({
                facultyDetails: key,
                feedbackItems: items.sort((a, b) => a.questionId - b.questionId)
            }))
        };

    } catch (error) {
        console.error('Error in getStudentReportData:', error);
        throw error;
    }
}

// Add a helper function to debug the database state
async function debugDatabaseState(studentId) {
    try {
        const scores = await db.query('SELECT * FROM scores WHERE student_id = ?', [studentId]);
        const faculties = await db.query('SELECT * FROM faculties');
        const questions = await db.query('SELECT * FROM questions');
        
        console.log('Database state:', {
            scoresCount: scores.length,
            facultiesCount: faculties.length,
            questionsCount: questions.length,
            sampleScore: scores[0]
        });
    } catch (error) {
        console.error('Error debugging database state:', error);
    }
}

module.exports = { 
    getStudentReportData,
    clearAllFeedback,
    debugDatabaseState
};
