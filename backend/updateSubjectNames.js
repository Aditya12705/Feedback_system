const mongoose = require('mongoose');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

const updateSubjectNames = async () => {
    try {
        const courses = await Course.find();
        for (const course of courses) {
            if (!course.subjectName) {
                // Assign a default subject name or derive it from the courseName
                course.subjectName = `Subject for ${course.courseName}`;
                await course.save();
                console.log(`Updated course: ${course.courseName} with subjectName: ${course.subjectName}`);
            }
        }
        console.log('Subject names updated successfully!');
    } catch (err) {
        console.error('Error updating subject names:', err);
    } finally {
        mongoose.connection.close();
    }
};

updateSubjectNames();
