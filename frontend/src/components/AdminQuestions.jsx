import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/admin/quiz/${quizId}/questions`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.success) {
          setQuestions(data.questions);
        } else {
          setError(data.message || 'Failed to load questions');
        }
      } catch (err) {
        setError('Error loading questions: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  if (loading) {
    return (
      <div className="screen">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h1>Loading Questions...</h1>
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
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="screen">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>Quiz Questions (Quiz ID: {quizId})</h1>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
            <p>No questions available for this quiz. Generate questions first!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen admin-questions-page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Quiz Questions (Quiz ID: {quizId})</h1>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div style={{ 
          backgroundColor: '#ecf0f1', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            Total Questions: {questions.length}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {questions.map((question, index) => (
            <div 
              key={question.id}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div 
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                style={{
                  padding: '20px',
                  backgroundColor: '#34495e',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>
                    Question {question.q_id}
                  </h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>
                    {question.question.substring(0, 100)}
                    {question.question.length > 100 ? '...' : ''}
                  </p>
                </div>
                <span style={{ fontSize: '20px' }}>
                  {expandedQuestion === index ? '▼' : '▶'}
                </span>
              </div>

              {expandedQuestion === index && (
                <div style={{ padding: '20px', borderTop: '1px solid #ddd' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0, color: '#2c3e50' }}>Question:</h4>
                    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                      {question.question}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0, color: '#2c3e50' }}>Options:</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px'
                    }}>
                      {question.options.map((option, optIdx) => (
                        <div 
                          key={optIdx}
                          style={{
                            padding: '12px',
                            backgroundColor: option === question.correct_answer ? '#d5f4e6' : '#f5f5f5',
                            border: option === question.correct_answer ? '2px solid #27ae60' : '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                              type="radio" 
                              disabled 
                              checked={option === question.correct_answer}
                            />
                            <span>{option}</span>
                            {option === question.correct_answer && (
                              <span style={{ 
                                marginLeft: 'auto', 
                                color: '#27ae60', 
                                fontWeight: 'bold',
                                fontSize: '14px'
                              }}>
                                ✓ Correct Answer
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    backgroundColor: '#e8f4f8',
                    borderLeft: '4px solid #3498db',
                    borderRadius: '4px'
                  }}>
                    <strong>Correct Answer:</strong> {question.correct_answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
