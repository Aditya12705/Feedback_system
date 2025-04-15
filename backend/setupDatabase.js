const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const xlsx = require('xlsx');
require('dotenv').config();

async function setupDatabase() {
    let connection;
    try {
        // Connect to existing database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'feedback_system'
        });

        // Start transaction
        await connection.beginTransaction();

        // Import students from Excel files
        console.log('Importing students...');
        const studentFiles = ['students.xlsx', 'aiml_students.xlsx'];
        for (const file of studentFiles) {
            try {
                console.log(`Processing file: ${file}`);
                const workbook = xlsx.readFile(path.join(__dirname, file));
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // Debug: Print sheet structure
                console.log('Sheet Headers:', xlsx.utils.sheet_to_json(sheet, { header: 1 })[0]);
                
                const studentsData = xlsx.utils.sheet_to_json(sheet, {
                    raw: true,
                    defval: null,
                    blankrows: false
                });
                
                console.log(`Found ${studentsData.length} students in ${file}`);
                
                for (const student of studentsData) {
                    // Debug: Print raw Excel row
                    console.log('Raw Excel Row:', student);

                    // Get column names from the Excel file
                    const keys = Object.keys(student);
                    console.log('Available columns:', keys);

                    // Map Excel columns to database fields with more specific checks
                    const studentData = {
                        usn: student['USN'] || student['Usn'] || student['usn'] || student['Student ID'] || student['StudentID'] || student['studentId'],
                        name: student['Name'] || student['NAME'] || student['name'] || student['Student Name'] || student['StudentName'],
                        semester: student['Semester'] || student['SEMESTER'] || student['semester'] || student['Sem'],
                        course: student['Course'] || student['COURSE'] || student['course'] || student['Branch']
                    };

                    // Debug: Print mapped data
                    console.log('Mapped student data:', studentData);

                    // Additional validation with detailed logging
                    if (!studentData.usn) {
                        console.warn('Missing USN:', student);
                        continue;
                    }
                    if (!studentData.name) {
                        console.warn('Missing Name:', student);
                        continue;
                    }
                    if (!studentData.semester) {
                        console.warn('Missing Semester:', student);
                        continue;
                    }
                    if (!studentData.course) {
                        console.warn('Missing Course:', student);
                        continue;
                    }

                    try {
                        const result = await connection.query(
                            `INSERT INTO students (studentId, name, semester, course, password, student_id) 
                             VALUES (?, ?, ?, ?, ?, ?)
                             ON DUPLICATE KEY UPDATE 
                             name = VALUES(name),
                             semester = VALUES(semester),
                             course = VALUES(course)`,
                            [
                                studentData.usn.toString().trim(),
                                studentData.name.toString().trim(),
                                parseInt(studentData.semester.toString()),
                                studentData.course.toString().trim().toLowerCase(),
                                studentData.usn.toString().trim(), // Using USN as password
                                studentData.usn.toString().trim()  // Using USN as student_id
                            ]
                        );
                        
                        // Debug: Print query result
                        console.log(`Insert result for ${studentData.usn}:`, result);
                    } catch (err) {
                        console.error(`Error inserting student ${studentData.usn}:`, err);
                        // Print the failed query details
                        console.error('Failed data:', studentData);
                    }
                }
            } catch (err) {
                console.error(`Error processing file ${file}:`, err);
            }
        }

        // Import faculties from Excel files
        console.log('Importing faculties...');
        const facultyFiles = ['CSE.xlsx', 'AI-ML.xlsx'];
        for (const file of facultyFiles) {
            const workbook = xlsx.readFile(path.join(__dirname, file));
            const facultiesData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            
            for (const faculty of facultiesData) {
                if (!faculty.name || !faculty.courseName || !faculty.subjectName || !faculty.semester) {
                    console.warn(`Skipping invalid faculty data:`, faculty);
                    continue;
                }

                // Ensure semester is in correct format
                let formattedSemester = faculty.semester;
                if (typeof faculty.semester === 'number') {
                    const semMap = {
                        1: '1st Semester',
                        2: '2nd Semester',
                        3: '3rd Semester',
                        4: '4th Semester'
                    };
                    formattedSemester = semMap[faculty.semester] || `${faculty.semester}th Semester`;
                }
                
                console.log(`Processing faculty: ${faculty.name}, Semester: ${formattedSemester}`);
                
                await connection.query(
                    `INSERT INTO faculties (name, courseName, subjectName, semester, professorName, 
                        subjectCode, academicYear, subject, isElective)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     name = VALUES(name),
                     courseName = VALUES(courseName),
                     subjectName = VALUES(subjectName),
                     professorName = VALUES(professorName),
                     subjectCode = VALUES(subjectCode),
                     academicYear = VALUES(academicYear),
                     subject = VALUES(subject),
                     isElective = VALUES(isElective)`,
                    [
                        faculty.name,
                        faculty.courseName.toLowerCase(),
                        faculty.subjectName,
                        formattedSemester,
                        faculty.professorName || faculty.name,
                        faculty.subjectCode || null,
                        faculty.academicYear || '2023-24',
                        faculty.subjectName,
                        faculty.name.includes('/')
                    ]
                );
            }
            console.log(`Imported faculties from ${file}`);
        }

        // Import questions from JSON
        console.log('Importing questions...');
        const questionsData = JSON.parse(
            await fs.readFile(path.join(__dirname, 'feedbackSystem.questions.json'), 'utf8')
        );

        let preQuestionId = 1;
        let postQuestionId = 101;

        for (const feedbackType of questionsData) {
            for (const questionText of feedbackType.questions) {
                const questionId = feedbackType.feedbackType === 'Pre-Feedback' ? preQuestionId++ : postQuestionId++;
                
                await connection.query(
                    `INSERT INTO questions (id, text, feedbackType)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE text = VALUES(text)`,
                    [questionId, questionText, feedbackType.feedbackType]
                );
            }
        }
        console.log('Imported all questions');

        // Commit transaction
        await connection.commit();
        console.log('Data import completed successfully!');

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error importing data:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the setup
setupDatabase().catch(console.error);
