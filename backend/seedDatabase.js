const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const db = require('./db'); // Ensure this points to your database connection file

async function seedDatabase() {
    try {
        console.log('Seeding actual data into SQL...');

        // Load and parse students.xlsx and aiml_students.xlsx
        const studentFiles = ['students.xlsx', 'aiml_students.xlsx'];
        let allStudentsData = []; // Collect all students data
        for (const file of studentFiles) {
            const filePath = path.join(__dirname, file);
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const studentsData = xlsx.utils.sheet_to_json(sheet);
            allStudentsData = allStudentsData.concat(studentsData); // Merge data
        }

        // Insert students into the database
        for (const student of allStudentsData) {
            const { usn, name, semester, course } = student;

            if (!usn || !name || !semester || !course) {
                console.warn(`Skipping student due to missing fields: ${JSON.stringify(student)}`);
                continue;
            }
            const password = usn; // Set password as the student's USN
            await db.query(
                `INSERT INTO students (studentId, name, semester, course)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE name = VALUES(name), semester = VALUES(semester), course = VALUES(course)`,
                [usn, name, semester, course]
            );
        }
        console.log('Students inserted successfully.');

        // Load and parse CSE.xlsx and AI-ML.xlsx for faculties
        const facultyFiles = ['CSE.xlsx', 'AI-ML.xlsx'];
        let facultyIdCounter = 1; // Start numeric IDs from 1
        for (const file of facultyFiles) {
            const filePath = path.join(__dirname, file);
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const facultiesData = xlsx.utils.sheet_to_json(sheet);

            // Insert faculties into the database
            for (const faculty of facultiesData) {
                const {
                    courseName = null,
                    subjectName = null,
                    semester = null,
                    professorName = null,
                    subjectCode = null,
                    academicYear = null,
                } = faculty;

                // Use numeric ID if `id` is required to be an integer
                const id = facultyIdCounter++;

                // Ensure all required fields are provided
                if (!courseName || !subjectName || !semester || !professorName || !academicYear) {
                    console.warn(`Skipping faculty due to missing fields: ${JSON.stringify(faculty)}`);
                    continue;
                }

                // Use professorName as the `name` field if `name` is required
                const name = professorName;

                // Use subjectName as the `subject` field if `subject` is required
                const subject = subjectName;

                await db.query(
                    `INSERT INTO faculties (id, name, courseName, subjectName, semester, professorName, subjectCode, academicYear, subject)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE name = VALUES(name), courseName = VALUES(courseName), subjectName = VALUES(subjectName), semester = VALUES(semester), professorName = VALUES(professorName), subjectCode = VALUES(subjectCode), academicYear = VALUES(academicYear), subject = VALUES(subject)`,
                    [id, name, courseName, subjectName, semester, professorName, subjectCode, academicYear, subject]
                );
            }
        }
        console.log('Faculties inserted successfully.');

        // Load and parse feedbackSystem.questions.json
        const questionsFilePath = path.join(__dirname, 'feedbackSystem.questions.json');
        const questionsData = JSON.parse(fs.readFileSync(questionsFilePath, 'utf-8'));

        // Insert questions into the database
        let questionId = 1; // Start question IDs from 1
        for (const feedbackType of questionsData) {
            for (const questionText of feedbackType.questions) {
                if (!questionText || !feedbackType.feedbackType) {
                    console.warn(`Skipping question due to missing fields: ${JSON.stringify(feedbackType)}`);
                    continue;
                }

                await db.query(
                    `INSERT INTO questions (id, text, feedbackType)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE text = VALUES(text), feedbackType = VALUES(feedbackType)`,
                    [questionId++, questionText, feedbackType.feedbackType]
                );
            }
        }
        console.log('Questions inserted successfully.');

        console.log('Actual data seeded successfully into SQL!');
    } catch (error) {
        console.error('Error seeding actual data:', error.message);
    } finally {
        process.exit();
    }
}

seedDatabase();
