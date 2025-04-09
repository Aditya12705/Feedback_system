const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function seedAndGenerateTrialData() {
    console.log('Seeding database...');
    try {
        console.log('Seeding data and generating trial feedback...');

        // Load and parse students.xlsx and aiml_students.xlsx
        const studentFiles = ['students.xlsx', 'aiml_students.xlsx'];
        let allStudentsData = [];
        for (const file of studentFiles) {
            const filePath = path.join(__dirname, file);
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const studentsData = xlsx.utils.sheet_to_json(sheet);
            // Normalize the data to ensure consistent field names
            const normalizedData = studentsData.map(student => ({
                usn: student.usn || student.USN || student.studentId || student.StudentId,
                name: student.name || student.Name,
                semester: student.semester || student.Semester,
                course: student.course || student.Course
            }));
            allStudentsData = allStudentsData.concat(normalizedData);
        }

        // Insert students into the database
        for (const student of allStudentsData) {
            const { usn, name, semester, course } = student;

            if (!usn || !name || !semester || !course) {
                console.warn(`Skipping student due to missing fields: ${JSON.stringify(student)}`);
                continue;
            }

            try {
                await db.query(
                    `INSERT INTO students (student_id, studentId, name, semester, course, password)
                     VALUES (?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE name = VALUES(name), semester = VALUES(semester), course = VALUES(course), password = VALUES(password)`,
                    [usn, usn, name, semester, course, usn]
                );
            } catch (error) {
                console.error(`Error inserting student ${usn}:`, error.message);
                continue;
            }
        }
        console.log('Students inserted successfully.');

        // Load and parse CSE.xlsx and AI-ML.xlsx for faculties
        const facultyFiles = ['CSE.xlsx', 'AI-ML.xlsx'];
        let facultyIdCounter = 1;
        for (const file of facultyFiles) {
            const filePath = path.join(__dirname, file);
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const facultiesData = xlsx.utils.sheet_to_json(sheet);

            for (const faculty of facultiesData) {
                const {
                    courseName = null,
                    subjectName = null,
                    semester = null,
                    professorName = null,
                    subjectCode = null,
                    academicYear = null,
                } = faculty;

                const id = facultyIdCounter++;

                if (!courseName || !subjectName || !semester || !professorName || !academicYear) {
                    console.warn(`Skipping faculty due to missing fields: ${JSON.stringify(faculty)}`);
                    continue;
                }

                const name = professorName;
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

        // Clear existing questions
        console.log('Clearing existing questions...');
        await db.query('DELETE FROM questions');

        // Insert questions into the database
        let preQuestionId = 1;
        let postQuestionId = 101;

        console.log('Inserting new questions...');
        for (const feedbackType of questionsData) {
            let questionIdCounter = feedbackType.feedbackType === 'Pre-Feedback' ? preQuestionId : postQuestionId;
            
            for (const questionText of feedbackType.questions) {
                if (!questionText || !feedbackType.feedbackType) {
                    console.warn(`Skipping question due to missing fields: ${JSON.stringify(feedbackType)}`);
                    continue;
                }

                await db.query(
                    `INSERT INTO questions (id, text, feedbackType)
                     VALUES (?, ?, ?)`,
                    [questionIdCounter++, questionText, feedbackType.feedbackType]
                );
            }

            if (feedbackType.feedbackType === 'Pre-Feedback') {
                preQuestionId = questionIdCounter;
            } else {
                postQuestionId = questionIdCounter;
            }
        }
        
        console.log('Questions inserted successfully.');
        console.log('Database seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding database:', error.message);
    } finally {
        process.exit();
    }
}

seedAndGenerateTrialData();
