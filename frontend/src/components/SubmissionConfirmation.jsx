import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubmissionConfirmation() {
  const navigate = useNavigate();
  const [submissionData, setSubmissionData] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Get submission data from localStorage
    const quizInfo = JSON.parse(localStorage.getItem('quizInfo') || '{}');
    const candidateId = localStorage.getItem('candidateId');
    const submittedAt = new Date().toLocaleString();
    
    setSubmissionData({
      quizInfo,
      candidateId,
      submittedAt
    });

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          localStorage.clear();
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const pageStyles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
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
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.2)',
      maxWidth: '600px',
      width: '100%',
      animation: 'slideUp 0.6s ease-out'
    },
    successHeader: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    successIcon: {
      fontSize: '80px',
      marginBottom: '20px',
      display: 'block',
      animation: 'bounce 0.6s ease-out'
    },
    title: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#11998e',
      margin: '0 0 10px 0'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666',
      margin: '0',
      letterSpacing: '0.5px'
    },
    messageBox: {
      background: '#f0fffe',
      border: '2px solid #11998e',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '30px',
      textAlign: 'center'
    },
    mainMessage: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#11998e',
      margin: '0 0 12px 0'
    },
    infoMessage: {
      fontSize: '14px',
      color: '#555',
      margin: '0',
      lineHeight: '1.6'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginBottom: '30px'
    },
    detailItem: {
      background: '#f5f5f5',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      padding: '15px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    detailLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#11998e',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px'
    },
    detailValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    countdownBox: {
      background: '#fff3cd',
      border: '2px solid #ffc107',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '25px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    countdownText: {
      fontSize: '14px',
      color: '#856404',
      fontWeight: '600',
      margin: '0'
    },
    countdownNumber: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#d39e00',
      display: 'inline-block',
      minWidth: '30px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap'
    },
    button: {
      flex: '1',
      minWidth: '150px',
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
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      color: 'white',
      boxShadow: '0 8px 20px rgba(17, 153, 142, 0.3)',
      flex: '2'
    },
    buttonSecondary: {
      background: 'white',
      color: '#11998e',
      border: '2px solid #11998e',
      boxShadow: '0 4px 15px rgba(17, 153, 142, 0.1)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 30px rgba(17, 153, 142, 0.4)'
    },
    checklist: {
      background: '#f9f9f9',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '25px'
    },
    checklistTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    checklistItem: {
      fontSize: '13px',
      color: '#555',
      marginBottom: '8px',
      paddingLeft: '24px',
      position: 'relative',
      lineHeight: '1.5'
    },
    checklistIcon: {
      position: 'absolute',
      left: '0',
      color: '#38ef7d'
    },
    keyframes: `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes bounce {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }
    `
  };

  return (
    <div style={pageStyles.container}>
      <style>{pageStyles.keyframes}</style>
      
      <div style={pageStyles.card}>
        {/* Success Header */}
        <div style={pageStyles.successHeader}>
          <span style={pageStyles.successIcon}>✅</span>
          <h1 style={pageStyles.title}>Exam Submitted!</h1>
          <p style={pageStyles.subtitle}>Your answers have been saved</p>
        </div>

        {/* Main Message */}
        <div style={pageStyles.messageBox}>
          <p style={pageStyles.mainMessage}>🎉 Thank you for taking the exam!</p>
          <p style={pageStyles.infoMessage}>
            Your exam has been successfully submitted. For your final results and detailed analysis, please contact the admin or check your email.
          </p>
        </div>

        {/* Submission Details */}
        {submissionData && (
          <div style={pageStyles.detailsGrid}>
            <div style={pageStyles.detailItem}>
              <div style={pageStyles.detailLabel}>📚 Topic</div>
              <div style={pageStyles.detailValue}>
                {submissionData.quizInfo.topic || 'N/A'}
              </div>
            </div>
            <div style={pageStyles.detailItem}>
              <div style={pageStyles.detailLabel}>❓ Questions</div>
              <div style={pageStyles.detailValue}>
                {submissionData.quizInfo.num_questions || 'N/A'}
              </div>
            </div>
            <div style={pageStyles.detailItem}>
              <div style={pageStyles.detailLabel}>⏱️ Time Limit</div>
              <div style={pageStyles.detailValue}>
                {submissionData.quizInfo.time_limit || 'N/A'} min
              </div>
            </div>
            <div style={pageStyles.detailItem}>
              <div style={pageStyles.detailLabel}>✅ Submitted</div>
              <div style={pageStyles.detailValue}>
                Just now
              </div>
            </div>
          </div>
        )}

        {/* What's Next Checklist */}
        <div style={pageStyles.checklist}>
          <div style={pageStyles.checklistTitle}>
            📋 What happens next:
          </div>
          <div style={pageStyles.checklistItem}>
            <span style={pageStyles.checklistIcon}>✓</span>
            Your exam will be evaluated by the admin
          </div>
          <div style={pageStyles.checklistItem}>
            <span style={pageStyles.checklistIcon}>✓</span>
            Results will be shared via email or dashboard
          </div>
          <div style={pageStyles.checklistItem}>
            <span style={pageStyles.checklistIcon}>✓</span>
            Contact admin for any queries about your results
          </div>
        </div>

        {/* Countdown Box */}
        <div style={pageStyles.countdownBox}>
          <span style={{ fontSize: '18px' }}>⏳</span>
          <p style={pageStyles.countdownText}>
            Redirecting to home in <span style={pageStyles.countdownNumber}>{countdown}</span>s
          </p>
        </div>

        {/* Action Buttons */}
        <div style={pageStyles.buttonGroup}>
          <button
            style={{ ...pageStyles.button, ...pageStyles.buttonPrimary }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(17, 153, 142, 0.3)';
            }}
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            🏠 Go to Home
          </button>
          <button
            style={{ ...pageStyles.button, ...pageStyles.buttonSecondary }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(17, 153, 142, 0.1)';
            }}
            onClick={() => navigate('/candidate/login')}
          >
            🔐 Login Again
          </button>
        </div>
      </div>
    </div>
  );
}
