const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    studentId: { type: String, unique: true, required: true }, // `studentId` represents `usn`
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' }, // Ensure role defaults to student
    course: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
});

module.exports = mongoose.model('User', userSchema);