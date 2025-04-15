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
                f.isElective
            FROM 
                scores s
                INNER JOIN faculties f ON s.faculty_id = f.id
                INNER JOIN questions q ON s.question_id = q.id
            WHERE 
                s.student_id = ?
            ORDER BY 
                f.id ASC,
                s.feedbackType ASC,
                s.question_id ASC`,
            [studentId]
        );

        // Process feedback data by faculty
        const processedFeedback = feedbackData.reduce((acc, item) => {
            const facultyKey = item.isElective ? 
                `${item.selected_faculty} - ${item.subjectName}` :
                `${item.faculty_name} - ${item.subjectName}`;

            if (!acc[facultyKey]) {
                acc[facultyKey] = {
                    facultyDetails: facultyKey,
                    feedbackItems: []
                };
            }

            acc[facultyKey].feedbackItems.push({
                question: item.question,
                score: item.score,
                comment: item.comment,
                questionId: item.questionId,
                feedbackType: item.feedbackType
            });

            return acc;
        }, {});

        return {
            studentName: student.name,
            usn: student.studentId,
            course: student.course,
            semester: student.semester,
            feedback: Object.values(processedFeedback)
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
