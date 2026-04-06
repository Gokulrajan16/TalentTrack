import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// PDF Generation using HTML to canvas approach
const generatePDFReport = async (result, quizId) => {
  try {
    // Create a new window with the content
    const printWindow = window.open('', '', 'width=800,height=600');
    
    let htmlContent = `
    <html>
    <head>
      <title>Quiz Results Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 40px;
          color: #333;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #667eea;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #667eea;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
          font-size: 12px;
        }
        .section {
          margin: 30px 0;
          page-break-inside: avoid;
        }
        .section-title {
          background: #f0f7ff;
          border-left: 4px solid #667eea;
          padding: 10px 15px;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 20px;
          color: #333;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        .summary-item {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          padding: 15px;
          border-radius: 8px;
        }
        .summary-item label {
          font-weight: 600;
          color: #667eea;
          font-size: 12px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 5px;
        }
        .summary-item .value {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }
        .status-passed {
          background: #d5f4e6;
          color: #155724;
        }
        .status-average {
          background: #fff3cd;
          color: #856404;
        }
        .status-failed {
          background: #f8d7da;
          color: #721c24;
        }
        .question-block {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-left: 4px solid #667eea;
          padding: 15px;
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        .question-number {
          font-weight: 700;
          color: #667eea;
          margin-bottom: 8px;
        }
        .question-text {
          font-weight: 600;
          margin-bottom: 10px;
          color: #333;
        }
        .answer-row {
          margin: 8px 0;
          font-size: 13px;
          padding: 5px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .answer-row:last-child {
          border-bottom: none;
        }
        .answer-row strong {
          color: #667eea;
          font-weight: 600;
          min-width: 120px;
          display: inline-block;
        }
        .answer-correct {
          background: #d5f4e6;
          padding: 8px;
          border-radius: 4px;
          color: #155724;
          font-weight: 600;
        }
        .answer-incorrect {
          background: #f8d7da;
          padding: 8px;
          border-radius: 4px;
          color: #721c24;
          font-weight: 600;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        @media print {
          body { margin: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Quiz Results Report</h1>
        <p>Quiz ID: ${quizId}</p>
        <p>Candidate: ${result.candidate_name}</p>
        <p>Submitted: ${result.submitted_at ? new Date(result.submitted_at).toLocaleString() : 'Not submitted'}</p>
      </div>
      
      <div class="section">
        <div class="section-title">📈 Summary</div>
        <div class="summary-grid">
          <div class="summary-item">
            <label>Score</label>
            <div class="value">${result.score}/${result.total_questions}</div>
          </div>
          <div class="summary-item">
            <label>Percentage</label>
            <div class="value">${result.percentage}%</div>
          </div>
          <div class="summary-item">
            <label>Status</label>
            <div class="value ${result.percentage >= 70 ? 'status-passed' : result.percentage >= 50 ? 'status-average' : 'status-failed'}" style="padding: 8px; border-radius: 4px; text-align: center;">
              ${result.percentage >= 70 ? '✓ PASSED' : result.percentage >= 50 ? 'AVERAGE' : '✗ FAILED'}
            </div>
          </div>
          <div class="summary-item">
            <label>Total Questions</label>
            <div class="value">${result.total_questions}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">❓ Detailed Answers</div>
        ${result.detailed_results && result.detailed_results.length > 0 ? result.detailed_results.map((detail, idx) => `
          <div class="question-block">
            <div class="question-number">Question ${idx + 1}</div>
            <div class="question-text">${detail.question?.question || 'Question'}</div>
            <div class="answer-row">
              <strong>Your Answer:</strong> ${detail.selected_options[0] || '<em>Not answered</em>'}
            </div>
            <div class="answer-row">
              <strong>Correct Answer:</strong> ${detail.correct_answers[0]}
            </div>
            <div class="answer-row">
              <span class="${detail.is_correct ? 'answer-correct' : 'answer-incorrect'}">
                ${detail.is_correct ? '✓ CORRECT' : '✗ INCORRECT'}
              </span>
            </div>
          </div>
        `).join('') : '<p>No detailed results available</p>'}
      </div>
      
      <div class="footer">
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>TalentTrack - Quiz Management System</p>
      </div>
    </body>
    </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
    
  } catch (err) {
    alert('Error generating PDF: ' + err.message);
  }
};

export default function AdminResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/admin/results/${quizId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.success) {
          setResults(data.results);
          setQuizInfo(data.quiz_info || {});
        } else {
          setError('Failed to load results');
        }
      } catch (err) {
        setError('Error loading results: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

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
      color: 'white',
      animation: 'slideDown 0.6s ease-out'
    },
    title: {
      fontSize: '36px',
      fontWeight: '800',
      margin: '0',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    },
    backButton: {
      padding: '12px 24px',
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '35px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      animation: 'slideUp 0.6s ease-out'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'white'
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '12px',
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
    rowAlternate: {
      background: '#f8f9ff'
    },
    scoreCell: {
      fontWeight: '700',
      color: '#667eea'
    },
    percentageBadge: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600'
    },
    badgePass: {
      background: '#d4edda',
      color: '#155724'
    },
    badgeAverage: {
      background: '#fff3cd',
      color: '#856404'
    },
    badgeFail: {
      background: '#f8d7da',
      color: '#721c24'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '8px 14px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    viewButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 10px rgba(102, 126, 234, 0.2)'
    },
    pdfButton: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      boxShadow: '0 4px 10px rgba(245, 87, 108, 0.2)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)'
    },
    expandedDetail: {
      background: '#f8f9ff',
      padding: '20px',
      borderRadius: '12px',
      border: '2px solid #667eea'
    },
    detailCard: {
      background: 'white',
      padding: '15px',
      marginBottom: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #667eea'
    },
    correctCard: {
      borderLeftColor: '#28a745',
      background: '#f0fff4'
    },
    incorrectCard: {
      borderLeftColor: '#dc3545',
      background: '#fff5f5'
    },
    correctText: {
      color: '#28a745',
      fontWeight: '700'
    },
    incorrectText: {
      color: '#dc3545',
      fontWeight: '700'
    },
    keyframes: `
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
    `
  };

  if (loading) {
    return (
      <div style={pageStyles.container}>
        <style>{pageStyles.keyframes}</style>
        <div style={pageStyles.emptyState}>
          <h2>⏳ Loading Results...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyles.container}>
        <style>{pageStyles.keyframes}</style>
        <div style={pageStyles.card}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ color: '#e74c3c', margin: '0 0 15px 0' }}>❌ Error</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
            <button
              style={{ ...pageStyles.button, ...pageStyles.viewButton }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.2)';
              }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles.container}>
      <style>{pageStyles.keyframes}</style>
      
      <div style={pageStyles.header}>
        <h1 style={pageStyles.title}>📊 Quiz Results</h1>
        <button
          style={pageStyles.backButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div style={pageStyles.card}>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ fontSize: '24px', color: '#667eea', margin: '0 0 10px 0' }}>📭 No Results Yet</h2>
            <p style={{ color: '#666', margin: '0' }}>Candidates have not submitted their exams.</p>
          </div>
        ) : (
          <div style={pageStyles.tableContainer}>
            <table style={pageStyles.table}>
              <thead style={pageStyles.thead}>
                <tr>
                  <th style={pageStyles.th}>👤 Candidate</th>
                  <th style={{ ...pageStyles.th, textAlign: 'center' }}>✓ Score</th>
                  <th style={{ ...pageStyles.th, textAlign: 'center' }}>❓ Total</th>
                  <th style={{ ...pageStyles.th, textAlign: 'center' }}>📈 %</th>
                  <th style={pageStyles.th}>📅 Submitted</th>
                  <th style={{ ...pageStyles.th, textAlign: 'center' }}>⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => {
                  const badgeStyle = result.percentage >= 70 
                    ? pageStyles.badgePass 
                    : result.percentage >= 50 
                      ? pageStyles.badgeAverage 
                      : pageStyles.badgeFail;

                  return (
                    <React.Fragment key={index}>
                      <tr style={{ 
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f7ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#f9f9f9' : '#fff'}
                      >
                        <td style={pageStyles.td}>
                          <strong>{result.candidate_name}</strong>
                        </td>
                        <td style={{ ...pageStyles.td, textAlign: 'center', ...pageStyles.scoreCell }}>
                          {result.score}/{result.total_questions}
                        </td>
                        <td style={{ ...pageStyles.td, textAlign: 'center' }}>
                          {result.total_questions}
                        </td>
                        <td style={{ ...pageStyles.td, textAlign: 'center' }}>
                          <span style={{ ...pageStyles.percentageBadge, ...badgeStyle }}>
                            {result.percentage}%
                          </span>
                        </td>
                        <td style={{ ...pageStyles.td, fontSize: '0.9em', color: '#666' }}>
                          {result.submitted_at ? new Date(result.submitted_at).toLocaleString() : 'Not submitted'}
                        </td>
                        <td style={{ ...pageStyles.td, textAlign: 'center' }}>
                          <div style={pageStyles.actionButtons}>
                            <button
                              style={{ ...pageStyles.button, ...pageStyles.viewButton }}
                              onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.2)';
                              }}
                              onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                            >
                              {expandedRow === index ? '👁️ Hide' : '👁️ View'}
                            </button>
                            <button
                              style={{ ...pageStyles.button, ...pageStyles.pdfButton }}
                              onMouseEnter={(e) => Object.assign(e.currentTarget.style, pageStyles.buttonHover)}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(245, 87, 108, 0.2)';
                              }}
                              onClick={() => generatePDFReport(result, quizId)}
                              title="Download results as PDF"
                            >
                              📥 PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr style={{ backgroundColor: '#f8f9ff', borderBottom: '2px solid #667eea' }}>
                          <td colSpan="6" style={{ padding: '20px' }}>
                            <div style={pageStyles.expandedDetail}>
                              <h3 style={{ marginTop: '0', marginBottom: '20px', color: '#333' }}>
                                📋 Detailed Answers for {result.candidate_name}
                              </h3>
                              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {result.detailed_results && result.detailed_results.length > 0 ? (
                                  result.detailed_results.map((detail, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        ...pageStyles.detailCard,
                                        ...(detail.is_correct ? pageStyles.correctCard : pageStyles.incorrectCard)
                                      }}
                                    >
                                      <p style={{ margin: '0 0 10px 0', fontWeight: '700', color: '#333' }}>
                                        Q{idx + 1}: {detail.question?.question || 'Question'}
                                      </p>
                                      <p style={{ margin: '6px 0', fontSize: '13px', color: '#555' }}>
                                        <strong>Your Answer:</strong> {detail.selected_options[0] || '❌ Not answered'}
                                      </p>
                                      <p style={{ margin: '6px 0', fontSize: '13px', color: '#555' }}>
                                        <strong>Correct Answer:</strong> {detail.correct_answers[0]}
                                      </p>
                                      <p style={{
                                        margin: '8px 0 0 0',
                                        fontWeight: '700',
                                        ...(detail.is_correct ? pageStyles.correctText : pageStyles.incorrectText)
                                      }}>
                                        {detail.is_correct ? '✓ CORRECT' : '✗ INCORRECT'}
                                      </p>
                                    </div>
                                  ))
                                ) : (
                                  <p style={{ textAlign: 'center', color: '#999' }}>No detailed results available</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
