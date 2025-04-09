const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    facultyName: { type: String, required: true },
    subjectName: { type: String, required: true }, // Add subjectName field
    semester: { type: Number, required: true, min: 1, max: 8 },
    isElective: { type: Boolean, default: false },
    facultyOptions: [{ type: String }],
});

module.exports = mongoose.model('Course', courseSchema);