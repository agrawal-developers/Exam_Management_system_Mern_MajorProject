const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  totalQuestions: { type: Number, default: 50 },
  totalMarks: { type: Number, default: 100 },
  instructions: { type: String, default: 'No negative marking' },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    marks: { type: Number, default: 1 }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);
