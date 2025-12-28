import React, { useState, useEffect } from 'react';
import { submissionsAPI } from '../services/api';

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await submissionsAPI.getMyResults();
      setResults(response.data.data || []);
    } catch (err) {
      console.error('Error loading results:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading results...</p></div>;

  return (
    <div className="container">
      <div className="results-container">
        <h2>📊 Your Exam Results</h2>
        {results.length === 0 ? (
          <p>No results yet. Take an exam first!</p>
        ) : (
          <div>
            {results.map((result, index) => (
              <div key={index} className="exam-card">
                <h3>{result.examTitle}</h3>
                <p><strong>Marks:</strong> {result.marks} / {result.totalMarks}</p>
                <p><strong>Percentage:</strong> {result.percentage}%</p>
                <p><strong>Status:</strong> <span className={`status-badge ${parseFloat(result.percentage) >= 40 ? 'pass' : 'fail'}`}>{parseFloat(result.percentage) >= 40 ? '✓ PASS' : '✗ FAIL'}</span></p>
                <p><strong>Submitted:</strong> {new Date(result.submittedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;
