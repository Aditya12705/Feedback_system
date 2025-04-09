const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Function to read Excel file and return data as JSON
const readExcelFile = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
};

// Function to normalize course names
const normalizeCourseName = (courseName) => {
    return courseName.trim().toLowerCase();
};

// Helper function to extract the numeric value from the semester string
const normalizeSemester = (semester) => {
    const match = semester.match(/\d+/); // Extract the first numeric value
    return match ? parseInt(match[0], 10) : null; // Convert to a number or return null if no match
};

// Function to ensure the course exists
const ensureCourseExists = async (courseData) => {
    try {
        if (!courseData.facultyName) {
            courseData.facultyName = "Default Faculty"; // Provide a default faculty name
        }
        if (!courseData.subjectName) {
            courseData.subjectName = `Default Subject for ${courseData.courseName}`; // Provide a default subject name
        }
        const course = new Course(courseData);
        await course.validate(); // Ensure validation passes
        await course.save();
        console.log(`Course ${courseData.courseName} for semester ${courseData.semester} created successfully.`);
    } catch (err) {
        console.error(`Error ensuring course ${courseData.courseName} for semester ${courseData.semester} exists:`, err);
    }
};

// Function to import faculties from XLSX files
const importFacultiesFromXLSX = async () => {
    try {
        const xlsxFiles = ['CSE.xlsx', 'AI-ML.xlsx'];
        for (const file of xlsxFiles) {
            console.log(`Processing file: ${file}`);
            const faculties = readExcelFile(file);

            for (const faculty of faculties) {
                const { courseName, professorName, subjectName, semester } = faculty; // Include subjectName

                if (!courseName || !professorName || !subjectName || !semester) {
                    console.log('Skipping invalid entry:', faculty);
                    continue;
                }

                const normalizedSemester = normalizeSemester(semester);
                const normalizedCourseName = normalizeCourseName(courseName);

                // Create new course entry
                const newCourse = new Course({
                    courseName: normalizedCourseName,
                    facultyName: professorName.trim(),
                    subjectName: subjectName.trim(), // Add subjectName
                    semester: normalizedSemester,
                    isElective: professorName.includes('/'),
                });

                await newCourse.save();
                console.log(`Added course: ${courseName} with faculty: ${professorName} and subject: ${subjectName}`);
            }
        }
        console.log('Completed faculty import');
    } catch (err) {
        console.error('Error importing faculties:', err);
    }
};

// Function to import students
const importStudents = async () => {
    try {
        const studentFiles = ['students.xlsx', 'aiml_students.xlsx']; // Add multiple student files
        for (const file of studentFiles) {
            console.log(`Reading ${file}...`);
            const students = readExcelFile(file);
            console.log(`Students data from ${file}:`, students); // Log all student data

            for (const student of students) {
                let { name, usn, password, course, year } = student;

                if (!course || !year) {
                    console.log(`Skipping student ${usn} due to missing course or year.`);
                    continue;
                }

                // Normalize course name to ensure consistency
                const normalizedCourseName = normalizeCourseName(course);

                // Convert year to semester (e.g., 1st year = 1st and 2nd semester)
                const semester = year * 2 - 1; // Assume odd semester for simplicity

                // Check if the course exists
                const existingCourse = await Course.findOne({ courseName: normalizedCourseName, semester });
                if (!existingCourse) {
                    console.log(`Skipping student ${usn} due to non-existent course: ${course} for semester ${semester}.`);
                    continue;
                }

                // Check if the student already exists
                const existingUser = await User.findOne({ studentId: usn });
                if (existingUser) {
                    console.log(`Student with USN ${usn} already exists, skipping...`);
                    continue;
                }

                // Log detailed information about the student being added
                console.log(`Adding student: ${name} (${usn}), Course: ${course}, Semester: ${semester}`);

                // Hash the password
                const hashedPassword = await bcrypt.hash(password.toString(), 10);

                // Create new student
                const newStudent = new User({
                    studentId: usn, // Use `usn` as `studentId`
                    name,
                    password: hashedPassword,
                    role: 'student', // Explicitly set role to student
                    course: normalizedCourseName,
                    semester,
                });

                await newStudent.save();
                console.log(`Added student: ${name} (${usn})`);
            }
        }
    } catch (err) {
        console.error('Error importing students:', err);
    }
};

// Main function to run the import
const runImport = async () => {
    try {
        // Clear existing students (except admin) and courses to avoid duplicates
        await User.deleteMany({ role: { $ne: 'admin' } });
        console.log('Cleared existing users (except admin).');
        await Course.deleteMany({});
        console.log('Cleared existing courses.');

        // Ensure AIML course exists explicitly
        console.log('Ensuring B.Tech AIML course for semester 1 exists...');
        await ensureCourseExists({ courseName: 'b.tech aiml', semester: 1, facultyName: 'Default Faculty', subjectName: 'Introduction to AIML' }); // Provide subjectName explicitly
        console.log('Ensuring B.Tech AIML course for semester 2 exists...');
        await ensureCourseExists({ courseName: 'b.tech aiml', semester: 2, facultyName: 'Default Faculty', subjectName: 'Advanced AIML' }); // Provide subjectName explicitly

        // Import faculties from XLSX files first
        await importFacultiesFromXLSX();

        // Import students after courses are populated
        await importStudents();

        console.log('Data import completed successfully!');
    } catch (err) {
        console.error('Error during import:', err);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

// Run the import
runImport();