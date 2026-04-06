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
      const adminId = localStorage.getItem('adminId');
      const response = await fetch('http://localhost:8000/api/admin/create_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, admin_id: parseInt(adminId) })
      });

      const data = await response.json();
      if (data.success) {
        setQuizId(data.quiz_id);
        setCredentials(data.credentials);
        
        // Store quiz data and credentials in localStorage
        localStorage.setItem(`quiz_${data.quiz_id}`, JSON.stringify(formData));
        localStorage.setItem(`credentials_${data.quiz_id}`, JSON.stringify(data.credentials));
        
        // Navigate to credentials page with the new URL
        navigate(`/admin/dashboard/credentials/${data.quiz_id}`);
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

  const pageStyles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      animation: 'slideDown 0.6s ease-out'
    },
    headerContent: {
      color: 'white'
    },
    title: {
      fontSize: '48px',
      fontWeight: '800',
      margin: '0 0 10px 0',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    },
    subtitle: {
      fontSize: '16px',
      opacity: '0.95',
      margin: '0',
      letterSpacing: '0.5px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    },
    navButton: {
      padding: '12px 24px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    navButtonHover: {
      background: 'rgba(255, 255, 255, 0.35)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      maxWidth: '800px',
      margin: '0 auto',
      animation: 'slideUp 0.6s ease-out'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gridColumn: 'span 1'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    input: {
      padding: '14px 16px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      background: '#f9f9f9'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#667eea',
      background: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    select: {
      padding: '14px 16px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      background: '#f9f9f9',
      cursor: 'pointer'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
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
      letterSpacing: '1px'
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
    topicField: {
      gridColumn: '1 / -1'
    },
    fullWidthField: {
      gridColumn: '1 / -1'
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
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `
  };

  return (
    <div style={pageStyles.container}>
      <style>{pageStyles.keyframes}</style>
      
      {/* Header Section */}
      <div style={pageStyles.header}>
        <div style={pageStyles.headerContent}>
          <h1 style={pageStyles.title}>📋 Create Quiz</h1>
          <p style={pageStyles.subtitle}>Set up a new quiz and generate candidate credentials</p>
        </div>
        <div style={pageStyles.buttonGroup}>
          <button
            style={pageStyles.navButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.navButtonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => navigate('/admin/profile')}
          >
            📊 My Profile
          </button>
          <button
            style={pageStyles.navButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.navButtonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminId');
              localStorage.removeItem('adminUsername');
              navigate('/admin/login');
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div style={pageStyles.card}>
        <form onSubmit={handleCreateQuiz}>
          {/* Topic Field */}
          <div style={{ ...pageStyles.formGroup, ...pageStyles.topicField, marginBottom: '30px' }}>
            <label htmlFor="topic" style={pageStyles.label}>
              📚 Quiz Topic
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="e.g., Python, React, Web Development"
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

          {/* Form Grid */}
          <div style={pageStyles.formGrid}>
            {/* Difficulty */}
            <div style={pageStyles.formGroup}>
              <label htmlFor="difficulty" style={pageStyles.label}>
                ⚡ Difficulty
              </label>
              <select 
                id="difficulty" 
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                style={pageStyles.select}
                onFocus={(e) => Object.assign(e.currentTarget.style, pageStyles.inputFocus)}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#f9f9f9';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div style={pageStyles.formGroup}>
              <label htmlFor="num_questions" style={pageStyles.label}>
                ❓ Questions
              </label>
              <input
                type="number"
                id="num_questions"
                name="num_questions"
                min="1"
                max="50"
                value={formData.num_questions}
                onChange={handleInputChange}
                style={pageStyles.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, pageStyles.inputFocus)}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#f9f9f9';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Time Limit */}
            <div style={pageStyles.formGroup}>
              <label htmlFor="time_limit" style={pageStyles.label}>
                ⏱️ Time (min)
              </label>
              <input
                type="number"
                id="time_limit"
                name="time_limit"
                min="5"
                max="180"
                value={formData.time_limit}
                onChange={handleInputChange}
                style={pageStyles.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, pageStyles.inputFocus)}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#f9f9f9';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Number of Candidates */}
            <div style={pageStyles.formGroup}>
              <label htmlFor="num_candidates" style={pageStyles.label}>
                👥 Candidates
              </label>
              <input
                type="number"
                id="num_candidates"
                name="num_candidates"
                min="1"
                max="100"
                value={formData.num_candidates}
                onChange={handleInputChange}
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
            {loading ? '⏳ Creating Quiz...' : '🚀 Create Quiz & Generate Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
}
