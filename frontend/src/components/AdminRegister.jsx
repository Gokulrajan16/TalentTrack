import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Admin account created. Redirecting to login...');
        setTimeout(() => navigate('/admin/login'), 1200);
      } else {
        setError(data.detail || data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="screen login-screen">
      <div className="login-container">
        <div className="login-box">
          <h1>Create Admin Account</h1>
          <p className="subtitle">Register a new admin to manage quizzes</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleRegister} className="form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
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
                placeholder="Enter a strong password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="login-footer" style={{ marginTop: '12px' }}>
            <button className="link-btn" onClick={() => navigate('/admin/login')}>
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
