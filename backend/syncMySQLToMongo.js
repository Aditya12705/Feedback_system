const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const db = require('./db');
const User = require('./models/User');
require('dotenv').config();

async function syncStudentsToMongo() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get all students from MySQL
        const [students] = await db.query(
            'SELECT student_id, name, semester, course FROM students'
        );

        console.log(`Found ${students.length} students in MySQL`);

        // Process each student
        for (const student of students) {
            try {
                // Check if student already exists in MongoDB
                const existingUser = await User.findOne({ studentId: student.student_id });
                
                if (!existingUser) {
                    // Create new user in MongoDB
                    const hashedPassword = await bcrypt.hash(student.student_id, 10); // Use student_id as password
                    const newUser = new User({
                        studentId: student.student_id,
                        name: student.name,
                        password: hashedPassword,
                        role: 'student',
                        course: student.course,
                        semester: student.semester
                    });
                    await newUser.save();
                    console.log(`Synced student: ${student.student_id}`);
                } else {
                    // Update existing user
                    existingUser.name = student.name;
                    existingUser.course = student.course;
                    existingUser.semester = student.semester;
                    await existingUser.save();
                    console.log(`Updated student: ${student.student_id}`);
                }
            } catch (err) {
                console.error(`Error processing student ${student.student_id}:`, err);
            }
        }

        console.log('Sync completed successfully');
    } catch (err) {
        console.error('Sync error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

syncStudentsToMongo();
