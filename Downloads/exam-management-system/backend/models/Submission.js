const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ questionId: mongoose.Schema.Types.ObjectId, studentAnswer: String }],
  marks: { type: Number, default: 0 },
  totalMarks: Number,
  submittedAt: { type: Date, default: Date.now }
}, { index: { exam: 1, student: 1, unique: true } });

module.exports = mongoose.model('Submission', submissionSchema);
