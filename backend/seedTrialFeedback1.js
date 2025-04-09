const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');
const Course = require('./models/Course');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

const seedTrialFeedback = async () => {
    try {
        console.log('Seeding trial feedback data...');

        // Fetch all students and courses
        const students = await User.find({ role: 'student' });
        const courses = await Course.find();

        console.log(`Found ${students.length} students and ${courses.length} courses.`);

        if (!students.length || !courses.length) {
            console.log('No students or courses found. Ensure the database is populated.');
            return;
        }

        const feedbackEntries = [];

        for (const student of students) {
            for (const course of courses) {
                // Generate random scores between 1 and 5 for 26 questions
                const scores = Array.from({ length: 26 }, () => Math.floor(Math.random() * 5) + 1);
                const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

                console.log(`Assigning feedback for student ${student._id} and course ${course._id} with semester ${course.semester}`); // Debugging log

                feedbackEntries.push({
                    studentId: student._id,
                    facultyId: course._id,
                    facultyName: course.facultyName,
                    subjectName: course.subjectName,
                    scores,
                    averageScore: parseFloat(averageScore.toFixed(2)), // Ensure averageScore is rounded and stored
                    comment: 'This is a trial feedback comment.',
                    semester: course.semester, // Add the semester field
                });
            }
        }

        console.log(`Prepared ${feedbackEntries.length} feedback entries for insertion.`);

        // Insert trial feedback into the database
        await Feedback.deleteMany(); // Clear existing feedback to avoid duplicates
        const result = await Feedback.insertMany(feedbackEntries);
        console.log(`Inserted ${result.length} trial feedback entries successfully!`);
    } catch (err) {
        console.error('Error seeding trial feedback data:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedTrialFeedback();
