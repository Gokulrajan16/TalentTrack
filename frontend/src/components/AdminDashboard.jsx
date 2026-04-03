import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'medium',
    num_questions: 5,
    time_limit: 30,
    num_candidates: 3
  });
  const [credentials, setCredentials] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'topic' ? value : parseInt(value) || value
    });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/admin/create_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setQuizId(data.quiz_id);
        setCredentials(data.credentials);
      } else {
        alert('Failed to create quiz');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const downloadCredentials = () => {
    const csvContent = [
      ['Username', 'Password', 'Email'],
      ...credentials.map(c => [c.username, c.password, c.email])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_${quizId}_credentials.csv`;
    a.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  if (credentials) {
    return (
      <div className="screen admin-results">
        <div className="container">
          <h1>Quiz Created Successfully!</h1>
          
          <div className="quiz-info">
            <h2>Quiz Details</h2>
            <p><strong>Quiz ID:</strong> {quizId}</p>
            <p><strong>Topic:</strong> {formData.topic}</p>
            <p><strong>Difficulty:</strong> {formData.difficulty}</p>
            <p><strong>Time Limit:</strong> {formData.time_limit} minutes</p>
            <p><strong>Number of Questions:</strong> {formData.num_questions}</p>
          </div>

          <div className="credentials-section">
            <h2>Candidate Credentials</h2>
            <p style={{ color: '#e74c3c', marginBottom: '20px' }}>
              ⚠️ Save these credentials and share with candidates. They will need these to login and take the quiz.
            </p>

            <div className="credentials-table">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {credentials.map((cred, idx) => (
                    <tr key={idx}>
                      <td>{cred.username}</td>
                      <td>{cred.password}</td>
                      <td>{cred.email}</td>
                      <td>
                        <button 
                          className="btn btn-small"
                          onClick={() => copyToClipboard(`${cred.username}:${cred.password}`)}
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={downloadCredentials}>
                Download CSV
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setCredentials(null);
                  setQuizId(null);
                }}
              >
                Create Another Quiz
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate(`/admin/results/${quizId}`)}
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Create a new quiz for candidates</p>

        <form onSubmit={handleCreateQuiz} className="quiz-form">
          <div className="form-group">
            <label htmlFor="topic">Quiz Topic:</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="e.g., Python, React, HTML"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty:</label>
              <select 
                id="difficulty" 
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="num_questions">Number of Questions:</label>
              <input
                type="number"
                id="num_questions"
                name="num_questions"
                min="1"
                max="50"
                value={formData.num_questions}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time_limit">Time Limit (minutes):</label>
              <input
                type="number"
                id="time_limit"
                name="time_limit"
                min="5"
                max="180"
                value={formData.time_limit}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="num_candidates">Number of Candidates:</label>
              <input
                type="number"
                id="num_candidates"
                name="num_candidates"
                min="1"
                max="100"
                value={formData.num_candidates}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quiz & Generate Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
}
