import React, { useState, useEffect } from 'react';
import { examsAPI } from '../services/api';

function ExamForm({ exam, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    duration: '',
    totalMarks: 100,
    instructions: 'No negative marking',
    questions: []
  });

  const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 });

  useEffect(() => {
    if (exam) {
      setFormData(exam);
    }
  }, [exam]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(o => o) && newQuestion.correctAnswer) {
      setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
      setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 });
    }
  };

  const removeQuestion = (index) => {
    setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (exam) {
        await examsAPI.update(exam._id, formData);
      } else {
        await examsAPI.create(formData);
      }
      onSubmit();
    } catch (err) {
      console.error('Error saving exam:', err);
    }
  };

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{exam ? 'Edit Exam' : 'Create New Exam'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Exam Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Total Marks</label>
            <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea name="instructions" value={formData.instructions} onChange={handleInputChange} rows="3"></textarea>
          </div>

          <h3>Questions</h3>
          {formData.questions.map((q, i) => (
            <div key={i} className="exam-card">
              <p><strong>Q{i + 1}: {q.question}</strong></p>
              <p>Options: {q.options.join(', ')}</p>
              <p>Correct: {q.correctAnswer}</p>
              <button type="button" className="btn btn-small btn-danger" onClick={() => removeQuestion(i)}>Remove</button>
            </div>
          ))}

          <h4>Add Question</h4>
          <div className="question-form">
            <input type="text" placeholder="Question" value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} />
            <div className="option-inputs">
              {newQuestion.options.map((opt, i) => (
                <input key={i} type="text" placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => {
                  const opts = [...newQuestion.options];
                  opts[i] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: opts });
                }} />
              ))}
            </div>
            <select value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}>
              <option value="">Select Correct Answer</option>
              {newQuestion.options.map((opt, i) => (<option key={i} value={opt}>{opt || `Option ${i + 1}`}</option>))}
            </select>
            <input type="number" min="1" value={newQuestion.marks} onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })} placeholder="Marks" />
            <button type="button" className="btn" onClick={addQuestion}>Add Question</button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn">Save Exam</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExamForm;
