import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminCredentials() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: '',
    time_limit: 0,
    num_questions: 0,
    num_candidates: 0
  });
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get quiz details from localStorage
    const quizData = localStorage.getItem(`quiz_${quizId}`);
    const credData = localStorage.getItem(`credentials_${quizId}`);
    
    if (quizData && credData) {
      setFormData(JSON.parse(quizData));
      setCredentials(JSON.parse(credData));
      setLoading(false);
    } else {
      // Redirect to dashboard if data not found
      navigate('/admin/dashboard');
    }
  }, [quizId, navigate]);

  const downloadCredentials = () => {
    if (!credentials) return;
    
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
      textAlign: 'center',
      color: 'white',
      marginBottom: '40px',
      animation: 'slideDown 0.6s ease-out'
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
    successIcon: {
      fontSize: '64px',
      marginBottom: '15px',
      display: 'block'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '35px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      marginBottom: '30px',
      animation: 'slideUp 0.6s ease-out'
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#333',
      marginTop: '0',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    quizInfoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    infoItem: {
      background: '#f8f9ff',
      padding: '15px',
      borderRadius: '12px',
      borderLeft: '4px solid #667eea'
    },
    infoLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#667eea',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '5px'
    },
    infoValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333'
    },
    warningBox: {
      background: '#fff3cd',
      border: '2px solid #ffc107',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    warningIcon: {
      fontSize: '24px',
      flexShrink: 0
    },
    warningText: {
      color: '#856404',
      fontSize: '14px',
      fontWeight: '500',
      margin: '0'
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '12px',
      marginBottom: '25px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
    thead: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    th: {
      padding: '15px',
      fontWeight: '600',
      textAlign: 'left',
      letterSpacing: '0.5px'
    },
    td: {
      padding: '14px 15px',
      borderBottom: '1px solid #e0e0e0',
      color: '#333'
    },
    tbody_tr: {
      transition: 'all 0.3s ease'
    },
    tbody_tr_hover: {
      background: '#f8f9ff'
    },
    copyButton: {
      padding: '6px 12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(102, 126, 234, 0.2)'
    },
    actionButtonGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '15px',
      marginTop: '25px'
    },
    button: {
      padding: '14px 24px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
    },
    buttonSecondary: {
      background: 'white',
      color: '#667eea',
      border: '2px solid #667eea',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
    },
    loadingContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    loadingSpinner: {
      fontSize: '48px',
      animation: 'spin 1s linear infinite'
    },
    errorContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    errorCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      textAlign: 'center',
      maxWidth: '500px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
    },
    errorIcon: {
      fontSize: '64px',
      marginBottom: '15px'
    },
    errorTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#e74c3c',
      margin: '0 0 10px 0'
    },
    errorText: {
      color: '#666',
      margin: '0 0 30px 0',
      fontSize: '14px'
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

  if (loading) {
    return (
      <div style={pageStyles.loadingContainer}>
        <style>{pageStyles.keyframes}</style>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={pageStyles.loadingSpinner}>⏳</div>
          <h2 style={{ marginTop: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!credentials) {
    return (
      <div style={pageStyles.errorContainer}>
        <style>{pageStyles.keyframes}</style>
        <div style={pageStyles.errorCard}>
          <div style={pageStyles.errorIcon}>❌</div>
          <h2 style={pageStyles.errorTitle}>Error</h2>
          <p style={pageStyles.errorText}>No credentials found for this quiz.</p>
          <button
            style={{ ...pageStyles.button, ...pageStyles.buttonPrimary }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
            onClick={() => navigate('/admin/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles.container}>
      <style>{pageStyles.keyframes}</style>
      
      {/* Header */}
      <div style={pageStyles.header}>
        <span style={pageStyles.successIcon}>✅</span>
        <h1 style={pageStyles.title}>Quiz Created!</h1>
        <p style={pageStyles.subtitle}>Your quiz is ready. Share credentials with candidates.</p>
      </div>

      {/* Quiz Details Card */}
      <div style={pageStyles.card}>
        <h2 style={pageStyles.cardTitle}>📋 Quiz Details</h2>
        <div style={pageStyles.quizInfoGrid}>
          <div style={pageStyles.infoItem}>
            <div style={pageStyles.infoLabel}>Quiz ID</div>
            <div style={pageStyles.infoValue}>{quizId}</div>
          </div>
          <div style={pageStyles.infoItem}>
            <div style={pageStyles.infoLabel}>📚 Topic</div>
            <div style={pageStyles.infoValue}>{formData.topic}</div>
          </div>
          <div style={pageStyles.infoItem}>
            <div style={pageStyles.infoLabel}>⚡ Difficulty</div>
            <div style={pageStyles.infoValue}>
              {formData.difficulty === 'easy' && '🟢 Easy'}
              {formData.difficulty === 'medium' && '🟡 Medium'}
              {formData.difficulty === 'hard' && '🔴 Hard'}
            </div>
          </div>
          <div style={pageStyles.infoItem}>
            <div style={pageStyles.infoLabel}>⏱️ Time Limit</div>
            <div style={pageStyles.infoValue}>{formData.time_limit} min</div>
          </div>
          <div style={pageStyles.infoItem}>
            <div style={pageStyles.infoLabel}>❓ Questions</div>
            <div style={pageStyles.infoValue}>{formData.num_questions}</div>
          </div>
          <div style={pageStyles.infoItem}>
            <div style={pageStyles.infoLabel}>👥 Candidates</div>
            <div style={pageStyles.infoValue}>{formData.num_candidates}</div>
          </div>
        </div>
      </div>

      {/* Credentials Card */}
      <div style={pageStyles.card}>
        <h2 style={pageStyles.cardTitle}>🔐 Candidate Credentials</h2>
        
        {/* Warning Box */}
        <div style={pageStyles.warningBox}>
          <div style={pageStyles.warningIcon}>⚠️</div>
          <p style={pageStyles.warningText}>Save these credentials and share with candidates. They will need these to login and take the quiz.</p>
        </div>

        {/* Credentials Table */}
        <div style={pageStyles.tableContainer}>
          <table style={pageStyles.table}>
            <thead style={pageStyles.thead}>
              <tr>
                <th style={pageStyles.th}>👤 Username</th>
                <th style={pageStyles.th}>🔒 Password</th>
                <th style={pageStyles.th}>📧 Email</th>
                <th style={pageStyles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((cred, idx) => (
                <tr 
                  key={idx}
                  style={pageStyles.tbody_tr}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={pageStyles.td}>
                    <code style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                      {cred.username}
                    </code>
                  </td>
                  <td style={pageStyles.td}>
                    <code style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                      {cred.password}
                    </code>
                  </td>
                  <td style={pageStyles.td}>{cred.email}</td>
                  <td style={pageStyles.td}>
                    <button 
                      style={pageStyles.copyButton}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1.05)', boxShadow: '0 6px 15px rgba(102, 126, 234, 0.4)' })}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.2)';
                      }}
                      onClick={() => {
                        copyToClipboard(`${cred.username}:${cred.password}`);
                      }}
                    >
                      📋 Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div style={pageStyles.actionButtonGroup}>
          <button
            style={{ ...pageStyles.button, ...pageStyles.buttonPrimary }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
            onClick={downloadCredentials}
          >
            📥 Download CSV
          </button>
          <button
            style={{ ...pageStyles.button, ...pageStyles.buttonSecondary }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.1)';
            }}
            onClick={() => navigate('/admin/dashboard')}
          >
            ➕ Create Another Quiz
          </button>
          <button
            style={{ ...pageStyles.button, ...pageStyles.buttonSecondary }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.1)';
            }}
            onClick={() => navigate(`/admin/questions/${quizId}`)}
          >
            👁️ View Questions
          </button>
          <button
            style={{ ...pageStyles.button, ...pageStyles.buttonSecondary }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.1)';
            }}
            onClick={() => navigate(`/admin/results/${quizId}`)}
          >
            📊 View Results
          </button>
        </div>
      </div>
    </div>
  );
}
