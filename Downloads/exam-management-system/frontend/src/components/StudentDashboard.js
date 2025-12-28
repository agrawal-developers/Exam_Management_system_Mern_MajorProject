import React, { useState } from 'react';
import SubmitExam from './SubmitExam';

function StudentDashboard({ exams, submittedExams, loading }) {
  const [takingExam, setTakingExam] = useState(null);

  const isExamSubmitted = (examId) => submittedExams.includes(examId);

  const handleExamSubmitted = (examId) => {
    const updated = [...submittedExams, examId];
    localStorage.setItem('submittedExams', JSON.stringify(updated));
    setTakingExam(null);
  };

  if (takingExam) {
    return <SubmitExam exam={takingExam} onSubmitted={() => handleExamSubmitted(takingExam._id)} onCancel={() => setTakingExam(null)} />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📚 Available Exams</h2>
      </div>

      {loading ? <p>Loading exams...</p> : exams.length === 0 ? <p>No exams available yet.</p> : (
        <div className="exam-grid">
          {exams.map(exam => (
            <div key={exam._id} className="exam-card">
              <h3>{exam.title}</h3>
              <div className="exam-info">
                <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {exam.duration} minutes</p>
                <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
                <p><strong>Questions:</strong> {exam.questions.length}</p>
                {isExamSubmitted(exam._id) && <span className="status-badge pass">✓ Submitted</span>}
              </div>
              <div className="exam-actions">
                {isExamSubmitted(exam._id) ? (
                  <button className="btn btn-small btn-secondary" disabled>Already Submitted</button>
                ) : (
                  <button className="btn btn-small" onClick={() => setTakingExam(exam)}>Take Exam</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
