import React, { useState, useEffect } from 'react';
import { submissionsAPI } from '../services/api';

function SubmitExam({ exam, onSubmitted, onCancel }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [exam.questions[currentQuestion]._id]: answer });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([qid, ans]) => ({ questionId: qid, studentAnswer: ans }));
    try {
      const response = await submissionsAPI.submit(exam._id, formattedAnswers);
      setResult(response.data.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting exam:', err);
    }
  };

  const question = exam.questions[currentQuestion];

  if (submitted) {
    return (
      <div className="container">
        <div className="result-card">
          <h2>✓ Exam Submitted!</h2>
          <p>Your Score: <strong>{result.marks} / {result.totalMarks}</strong></p>
          <p>Percentage: <strong>{((result.marks / result.totalMarks) * 100).toFixed(2)}%</strong></p>
          <p className={`status-badge ${((result.marks / result.totalMarks) * 100) >= 40 ? 'pass' : 'fail'}`}>
            {((result.marks / result.totalMarks) * 100) >= 40 ? '✓ PASS' : '✗ FAIL'}
          </p>
          <button className="btn" onClick={() => { onSubmitted(); onCancel(); }}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>{exam.title}</h2>
          <div className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>⏱️ Time Left: {formatTime(timeLeft)}</div>
        </div>

        {question && (
          <div>
            <div className="question-display">
              <h3>Question {currentQuestion + 1} of {exam.questions.length}</h3>
              <p>{question.question}</p>
              <div className="options-list">
                {question.options.map((opt, i) => (
                  <button key={i} className={`option-button ${answers[question._id] === opt ? 'selected' : ''}`} onClick={() => handleAnswer(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn" onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>← Previous</button>
              <span style={{ padding: '12px', background: '#f0f0f0', borderRadius: '6px' }}>{currentQuestion + 1} of {exam.questions.length}</span>
              <button className="btn" onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))} disabled={currentQuestion === exam.questions.length - 1}>Next →</button>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button className="btn btn-danger" onClick={handleSubmit}>Submit Exam</button>
              <button className="btn btn-secondary" onClick={onCancel}>Cancel (Unsaved)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmitExam;
