import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const pageStyles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '50px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      maxWidth: '450px',
      width: '100%',
      animation: 'slideUp 0.6s ease-out'
    },
    header: {
      textAlign: 'center',
      marginBottom: '35px'
    },
    icon: {
      fontSize: '64px',
      marginBottom: '15px',
      display: 'block'
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#333',
      margin: '0 0 10px 0'
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      margin: '0',
      letterSpacing: '0.5px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    inputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    input: {
      width: '100%',
      padding: '14px 16px 14px 45px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      background: '#f9f9f9',
      boxSizing: 'border-box'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#667eea',
      background: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    inputIcon: {
      position: 'absolute',
      left: '15px',
      fontSize: '18px',
      color: '#667eea',
      pointerEvents: 'none'
    },
    togglePassword: {
      position: 'absolute',
      right: '12px',
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '0',
      color: '#667eea',
      transition: 'all 0.2s ease'
    },
    submitButton: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginTop: '10px'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
    },
    submitButtonDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed',
      transform: 'none'
    },
    errorMessage: {
      background: '#f8d7da',
      border: '2px solid #e74c3c',
      color: '#721c24',
      padding: '14px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px',
      animation: 'slideDown 0.4s ease-out',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    successMessage: {
      background: '#d5f4e6',
      border: '2px solid #28a745',
      color: '#155724',
      padding: '14px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px',
      animation: 'slideDown 0.4s ease-out',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    messageIcon: {
      fontSize: '18px'
    },
    footer: {
      marginTop: '30px',
      textAlign: 'center',
      borderTop: '1px solid #e0e0e0',
      paddingTop: '20px'
    },
    footerText: {
      color: '#666',
      fontSize: '14px',
      margin: '0 0 15px 0'
    },
    loginButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(102, 126, 234, 0.2)'
    },
    loginButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(102, 126, 234, 0.3)'
    },
    passwordRequirements: {
      background: '#f0f7ff',
      border: '1px solid #e0e8ff',
      borderRadius: '10px',
      padding: '12px 14px',
      marginTop: '15px',
      fontSize: '12px',
      color: '#555',
      lineHeight: '1.6'
    },
    requirementItem: {
      margin: '6px 0',
      paddingLeft: '20px',
      position: 'relative'
    },
    requirementIcon: {
      position: 'absolute',
      left: '0',
      color: '#667eea'
    },
    keyframes: `
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
          transform: translateY(-15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
  };

  return (
    <div style={pageStyles.container}>
      <style>{pageStyles.keyframes}</style>
      
      <div style={pageStyles.card}>
        {/* Header */}
        <div style={pageStyles.header}>
          <span style={pageStyles.icon}>👨‍💼</span>
          <h1 style={pageStyles.title}>Create Admin</h1>
          <p style={pageStyles.subtitle}>Register a new admin account to manage quizzes</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={pageStyles.errorMessage}>
            <span style={pageStyles.messageIcon}>❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={pageStyles.successMessage}>
            <span style={pageStyles.messageIcon}>✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister}>
          {/* Username Field */}
          <div style={pageStyles.formGroup}>
            <label htmlFor="username" style={pageStyles.label}>
              👤 Username
            </label>
            <div style={pageStyles.inputContainer}>
              <span style={pageStyles.inputIcon}>👤</span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                required
                style={pageStyles.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, pageStyles.inputFocus)}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#f9f9f9';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Email Field */}
          <div style={pageStyles.formGroup}>
            <label htmlFor="email" style={pageStyles.label}>
              📧 Email
            </label>
            <div style={pageStyles.inputContainer}>
              <span style={pageStyles.inputIcon}>📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
                required
                style={pageStyles.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, pageStyles.inputFocus)}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#f9f9f9';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={pageStyles.formGroup}>
            <label htmlFor="password" style={pageStyles.label}>
              🔒 Password
            </label>
            <div style={pageStyles.inputContainer}>
              <span style={pageStyles.inputIcon}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter a strong password"
                required
                style={pageStyles.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, pageStyles.inputFocus)}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#f9f9f9';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                style={pageStyles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            {/* Password Requirements */}
            <div style={pageStyles.passwordRequirements}>
              <div style={pageStyles.requirementItem}>
                <span style={pageStyles.requirementIcon}>ℹ️</span>
                Password should be at least 6 characters
              </div>
              <div style={pageStyles.requirementItem}>
                <span style={pageStyles.requirementIcon}>ℹ️</span>
                Use a mix of uppercase and lowercase letters
              </div>
              <div style={pageStyles.requirementItem}>
                <span style={pageStyles.requirementIcon}>ℹ️</span>
                Include numbers for better security
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...pageStyles.submitButton,
              ...(loading ? pageStyles.submitButtonDisabled : {})
            }}
            onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, pageStyles.submitButtonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
            disabled={loading}
          >
            {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div style={pageStyles.footer}>
          <p style={pageStyles.footerText}>Already have an account?</p>
          <button
            style={pageStyles.loginButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.loginButtonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.2)';
            }}
            onClick={() => navigate('/admin/login')}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
