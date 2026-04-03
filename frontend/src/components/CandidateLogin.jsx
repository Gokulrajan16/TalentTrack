import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CandidateLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/candidate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Store candidate info in localStorage
        localStorage.setItem('candidateToken', data.token);
        localStorage.setItem('candidateId', data.candidate_id);
        localStorage.setItem('quizId', data.quiz_id);
        localStorage.setItem('quizInfo', JSON.stringify({
          topic: data.topic,
          difficulty: data.difficulty,
          time_limit: data.time_limit,
          num_questions: data.num_questions
        }));
        
        navigate('/candidate/quiz');
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="screen login-screen">
      <div className="login-container">
        <div className="login-box">
          <h1>Candidate Login</h1>
          <p className="subtitle">Enter your credentials to start the exam</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin} className="form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="e.g., candidate_1_1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have credentials? Contact your admin.</p>
            <button 
              className="link-btn"
              onClick={() => window.history.back()}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
