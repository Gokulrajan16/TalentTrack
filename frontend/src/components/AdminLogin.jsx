import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        localStorage.setItem('adminUsername', formData.username);
        navigate('/admin/profile');
      } else {
        setError(data.detail || data.error || 'Login failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        animation: 'slideUp 0.6s ease-out'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 30px 30px',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>
            👨‍💼
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 10px 0',
            letterSpacing: '-0.5px'
          }}>
            Admin Login
          </h1>
          <p style={{
            fontSize: '14px',
            opacity: 0.9,
            margin: 0,
            fontWeight: '500'
          }}>
            Welcome back! Manage your quizzes and candidates
          </p>
        </div>

        {/* Form Section */}
        <div style={{ padding: '40px 30px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fee',
              border: '2px solid #f44',
              color: '#c33',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username Field */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
                letterSpacing: '0.5px'
              }}>
                USERNAME
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  fontSize: '18px',
                  color: '#999'
                }}>
                  👤
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 45px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#f9f9f9'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#f9f9f9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
                letterSpacing: '0.5px'
              }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  fontSize: '18px',
                  color: '#999'
                }}>
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 45px 12px 45px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#f9f9f9'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#f9f9f9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#999',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#667eea'}
                  onMouseLeave={(e) => e.target.style.color = '#999'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '13px 20px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
                marginTop: '10px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                transform: loading ? 'scale(1)' : 'scale(1)'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)')}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                  Signing in...
                </span>
              ) : (
                '🚀 Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            margin: '30px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#999'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
          </div>

          {/* Links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                Don't have an account?{' '}
              </span>
              <button
                onClick={() => navigate('/admin/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  textDecoration: 'underline'
                }}
                onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                onMouseLeave={(e) => e.target.style.color = '#667eea'}
              >
                Create Admin Account
              </button>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#667eea'}
              onMouseLeave={(e) => e.target.style.color = '#999'}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        input::placeholder {
          color: #bbb;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}
