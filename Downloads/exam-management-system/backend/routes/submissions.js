const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Exam = require('../models/Exam');
const { protect, authorize } = require('../middleware/auth');

router.post('/submit/:examId', protect, authorize('student'), async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    const existingSubmission = await Submission.findOne({ exam: examId, student: req.user._id });
    if (existingSubmission) return res.status(400).json({ success: false, message: 'You have already submitted this exam' });
    let marks = 0;
    exam.questions.forEach(question => {
      const studentAnswer = answers.find(a => a.questionId === question._id.toString());
      if (studentAnswer && studentAnswer.studentAnswer === question.correctAnswer) {
        marks += question.marks;
      }
    });
    const submission = await Submission.create({
      exam: examId,
      student: req.user._id,
      answers,
      marks,
      totalMarks: exam.totalMarks
    });
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/my-results', protect, authorize('student'), async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id }).populate('exam', 'title totalMarks');
    const results = submissions.map(sub => ({
      _id: sub._id,
      examTitle: sub.exam.title,
      marks: sub.marks,
      totalMarks: sub.totalMarks,
      percentage: ((sub.marks / sub.totalMarks) * 100).toFixed(2),
      submittedAt: sub.submittedAt
    }));
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/exam/:examId', protect, authorize('admin'), async (req, res) => {
  try {
    const submissions = await Submission.find({ exam: req.params.examId }).populate('student', 'name email');
    const results = submissions.map(sub => ({
      studentName: sub.student.name,
      studentEmail: sub.student.email,
      marks: sub.marks,
      totalMarks: sub.totalMarks,
      percentage: ((sub.marks / sub.totalMarks) * 100).toFixed(2),
      submittedAt: sub.submittedAt
    }));
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
