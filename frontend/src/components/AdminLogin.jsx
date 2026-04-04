import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminId', data.admin_id);
        navigate('/admin/dashboard');
      } else {
        setError(data.detail || data.error || 'Login failed');
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
          <h1>Admin Login</h1>
          <p className="subtitle">Sign in to manage quizzes and candidates</p>

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
                placeholder="Admin username"
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer" style={{ marginTop: '12px' }}>
            <p>Don't have an admin account?</p>
            <button className="link-btn" onClick={() => navigate('/admin/register')}>
              Create Admin Account
            </button>
          </div>

          <div className="login-footer" style={{ marginTop: '8px' }}>
            <button className="link-btn" onClick={() => navigate('/')}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
