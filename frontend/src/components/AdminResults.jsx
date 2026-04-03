import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/admin/results/${quizId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.success) {
          setResults(data.results);
        } else {
          setError('Failed to load results');
        }
      } catch (err) {
        setError('Error loading results: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="screen">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h1>Loading Results...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
            <h1>Error</h1>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/dashboard')}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen admin-results-page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Quiz Results (Quiz ID: {quizId})</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </button>
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
            <p>No results available yet. Candidates have not submitted their exams.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Candidate Name</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Total Questions</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Percentage</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Submitted At</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <React.Fragment key={index}>
                    <tr style={{ 
                      borderBottom: '1px solid #ecf0f1',
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'
                    }}>
                      <td style={{ padding: '12px' }}>{result.candidate_name}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#27ae60' }}>
                        {result.score}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{result.total_questions}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                        <span style={{
                          backgroundColor: result.percentage >= 70 ? '#d5f4e6' : result.percentage >= 50 ? '#fef5e7' : '#fadbd8',
                          color: result.percentage >= 70 ? '#27ae60' : result.percentage >= 50 ? '#f39c12' : '#e74c3c',
                          padding: '6px 12px',
                          borderRadius: '4px'
                        }}>
                          {result.percentage}%
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.9em', color: '#666' }}>
                        {result.submitted_at ? new Date(result.submitted_at).toLocaleString() : 'Not submitted'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button 
                          className="btn btn-small"
                          onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.85em',
                            backgroundColor: '#3498db',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {expandedRow === index ? 'Hide' : 'View'} Details
                        </button>
                      </td>
                    </tr>
                    {expandedRow === index && (
                      <tr style={{ backgroundColor: '#f0f7ff', borderBottom: '2px solid #3498db' }}>
                        <td colSpan="6" style={{ padding: '20px' }}>
                          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #3498db' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50' }}>
                              Detailed Answers for {result.candidate_name}
                            </h3>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                              {result.detailed_results && result.detailed_results.map((detail, idx) => (
                                <div 
                                  key={idx}
                                  style={{
                                    padding: '12px',
                                    marginBottom: '10px',
                                    border: detail.is_correct ? '2px solid #27ae60' : '2px solid #e74c3c',
                                    borderRadius: '5px',
                                    backgroundColor: detail.is_correct ? '#d5f4e6' : '#fadbd8'
                                  }}
                                >
                                  <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                                    Q{idx + 1}: {detail.question?.question || 'Question'}
                                  </p>
                                  <p style={{ margin: '5px 0' }}>
                                    <strong>Candidate's Answer:</strong> {detail.selected_options[0] || 'Not answered'}
                                  </p>
                                  <p style={{ margin: '5px 0' }}>
                                    <strong>Correct Answer:</strong> {detail.correct_answers[0]}
                                  </p>
                                  <p style={{ 
                                    margin: '5px 0', 
                                    fontWeight: 'bold',
                                    color: detail.is_correct ? '#27ae60' : '#e74c3c'
                                  }}>
                                    {detail.is_correct ? '✓ Correct' : '✗ Incorrect'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
