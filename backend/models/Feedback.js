const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    facultyName: { type: String, required: true },
    subjectName: { type: String, required: true },
    scores: { type: [Number], required: true },
    averageScore: { type: Number, required: true },
    comment: { type: String }, // Add comment field
});

module.exports = mongoose.model('Feedback', feedbackSchema);