import React, { useState, useEffect } from 'react';
import { examsAPI } from '../services/api';
import AdminDashboard from '../components/AdminDashboard';

function AdminPage() {
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await examsAPI.getAll();
      setExams(response.data.data || []);
    } catch (err) {
      console.error('Error loading exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExamAdded = () => {
    setShowForm(false);
    loadExams();
  };

  const handleExamDeleted = (id) => {
    setExams(exams.filter(e => e._id !== id));
  };

  return (
    <div className="container">
      <AdminDashboard exams={exams} onExamAdded={handleExamAdded} onExamDeleted={handleExamDeleted} loading={loading} />
    </div>
  );
}

export default AdminPage;
