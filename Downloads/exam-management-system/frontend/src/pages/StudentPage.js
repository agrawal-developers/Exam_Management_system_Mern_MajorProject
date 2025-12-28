import React, { useState, useEffect } from 'react';
import { examsAPI } from '../services/api';
import StudentDashboard from '../components/StudentDashboard';

function StudentPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittedExams, setSubmittedExams] = useState([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await examsAPI.getAll();
      setExams(response.data.data || []);
      const submitted = localStorage.getItem('submittedExams') ? JSON.parse(localStorage.getItem('submittedExams')) : [];
      setSubmittedExams(submitted);
    } catch (err) {
      console.error('Error loading exams:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <StudentDashboard exams={exams} submittedExams={submittedExams} loading={loading} />
    </div>
  );
}

export default StudentPage;
