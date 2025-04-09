const db = require('./db'); // Ensure this points to your database connection file

async function seedTrialFeedback() {
    try {
        console.log('Seeding trial feedback data into SQL...');

        // Fetch all students
        const students = await db.query('SELECT studentId, semester FROM students');
        const faculties = await db.query('SELECT id, semester FROM faculties');

        for (const student of students) {
            const matchingFaculties = faculties.filter(faculty => parseInt(faculty.semester) === parseInt(student.semester));

            if (matchingFaculties.length === 0) {
                console.warn(`No faculties found for student ${student.studentId} in semester ${student.semester}`);
                continue;
            }

            for (const faculty of matchingFaculties) {
                for (let i = 1; i <= 26; i++) { // 26 questions
                    const randomScore = Math.floor(Math.random() * 5) + 1; // Random score between 1 and 5
                    const randomComment = `This is a trial comment for question ${i}.`;

                    await db.query(
                        `INSERT INTO scores (student_id, question_id, score, faculty_id, semester, feedbackType, comment)
                         VALUES (?, ?, ?, ?, ?, ?, ?)
                         ON DUPLICATE KEY UPDATE score = VALUES(score), comment = VALUES(comment), feedbackType = VALUES(feedbackType)`,
                        [student.studentId, i, randomScore, faculty.id, student.semester, 'Trial', randomComment]
                    );
                }
            }
        }
        console.log('Trial feedback data seeded successfully!');
    } catch (error) {
        console.error('Error seeding trial feedback data:', error.message);
    } finally {
        process.exit();
    }
}

seedTrialFeedback();
