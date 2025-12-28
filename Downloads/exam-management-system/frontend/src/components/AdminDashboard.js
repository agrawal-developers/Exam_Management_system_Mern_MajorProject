import React, { useState } from 'react';
import { examsAPI } from '../services/api';
import ExamForm from './ExamForm';

function AdminDashboard({ exams, onExamAdded, onExamDeleted, loading }) {
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examsAPI.delete(id);
        onExamDeleted(id);
      } catch (err) {
        console.error('Error deleting exam:', err);
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📝 Admin Dashboard</h2>
        <button className="btn" onClick={() => { setEditingExam(null); setShowForm(true); }}>+ Create New Exam</button>
      </div>

      {showForm && (
        <ExamForm exam={editingExam} onSubmit={() => { setShowForm(false); onExamAdded(); }} onCancel={() => setShowForm(false)} />
      )}

      <h3>📋 All Exams</h3>
      {loading ? <p>Loading exams...</p> : exams.length === 0 ? <p>No exams created yet.</p> : (
        <div className="exam-grid">
          {exams.map(exam => (
            <div key={exam._id} className="exam-card">
              <h3>{exam.title}</h3>
              <div className="exam-info">
                <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {exam.duration} minutes</p>
                <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
                <p><strong>Questions:</strong> {exam.questions.length}</p>
              </div>
              <div className="exam-actions">
                <button className="btn btn-small" onClick={() => { setEditingExam(exam); setShowForm(true); }}>Edit</button>
                <button className="btn btn-small btn-danger" onClick={() => handleDelete(exam._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
