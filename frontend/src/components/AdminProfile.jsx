import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUsername, setAdminUsername] = useState('');

  useEffect(() => {
    const fetchAdminQuizzes = async () => {
      try {
        const adminId = localStorage.getItem('adminId');
        const adminToken = localStorage.getItem('adminToken');
        
        if (!adminId || !adminToken) {
          navigate('/admin/login');
          return;
        }

        const response = await fetch(`http://localhost:8000/api/admin/my-quizzes/${adminId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.success) {
          setQuizzes(data.quizzes);
          const username = localStorage.getItem('adminUsername');
          setAdminUsername(username || 'Admin');
        } else {
          setError(data.error || 'Failed to load quizzes');
        }
      } catch (err) {
        setError('Error loading quizzes: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminQuizzes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return { bg: '#d4edda', text: '#155724', icon: '🟢' };
      case 'medium': return { bg: '#fff3cd', text: '#856404', icon: '🟡' };
      case 'hard': return { bg: '#f8d7da', text: '#721c24', icon: '🔴' };
      default: return { bg: '#e2e3e5', text: '#383d41', icon: '⚪' };
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <div style={{
            fontSize: '60px',
            marginBottom: '20px',
            animation: 'bounce 2s infinite'
          }}>
            ⏳
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Loading your profile...</h2>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '30px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '40px 30px',
          marginBottom: '40px',
          color: '#ffffff',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👨‍💼</div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              margin: '0 0 5px 0',
              letterSpacing: '-0.5px'
            }}>
              Welcome, {adminUsername}!
            </h1>
            <p style={{
              fontSize: '15px',
              opacity: 0.95,
              margin: 0,
              fontWeight: '500'
            }}>
              Manage your quizzes and track candidate performance
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/admin/dashboard')}
              style={{
                padding: '12px 24px',
                background: '#ffffff',
                color: '#667eea',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              ➕ Create New Quiz
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Error Section */}
        {error && (
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#fee',
            border: '2px solid #f44',
            color: '#c33',
            borderRadius: '12px',
            marginBottom: '30px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Stats Section */}
        {quizzes.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '2px solid #667eea'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
              <h3 style={{ margin: '0 0 5px 0', color: '#667eea', fontSize: '24px', fontWeight: '700' }}>
                {quizzes.length}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px', fontWeight: '600' }}>
                Quizzes Created
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '2px solid #3498db'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(52, 152, 219, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
              <h3 style={{ margin: '0 0 5px 0', color: '#3498db', fontSize: '24px', fontWeight: '700' }}>
                {quizzes.reduce((sum, q) => sum + q.num_candidates, 0)}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px', fontWeight: '600' }}>
                Total Candidates
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '2px solid #27ae60'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(39, 174, 96, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
              <h3 style={{ margin: '0 0 5px 0', color: '#27ae60', fontSize: '24px', fontWeight: '700' }}>
                {quizzes.reduce((sum, q) => sum + q.num_results, 0)}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px', fontWeight: '600' }}>
                Results Submitted
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {quizzes.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '80px 40px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            animation: 'slideUp 0.6s ease-out'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>📭</div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#333',
              margin: '0 0 10px 0'
            }}>
              No Quizzes Yet
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0 0 30px 0',
              lineHeight: '1.6'
            }}>
              You haven't created any quizzes yet. Get started by creating your first quiz!
            </p>
            <button
              onClick={() => navigate('/admin/dashboard')}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              🚀 Create Your First Quiz
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#333',
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📋 Your Quizzes
            </h2>

            {/* Quiz Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {quizzes.map((quiz) => {
                const diffColor = getDifficultyColor(quiz.difficulty);
                return (
                  <div
                    key={quiz.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      border: '1px solid #e0e0e0',
                      animation: 'slideUp 0.6s ease-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Card Header */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#333',
                            margin: '0 0 5px 0'
                          }}>
                            {quiz.topic}
                          </h3>
                          <p style={{
                            fontSize: '12px',
                            color: '#999',
                            margin: 0,
                            fontWeight: '500'
                          }}>
                            Quiz #{quiz.id}
                          </p>
                        </div>
                        <span style={{
                          padding: '6px 12px',
                          backgroundColor: diffColor.bg,
                          color: diffColor.text,
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          whiteSpace: 'nowrap'
                        }}>
                          {diffColor.icon} {quiz.difficulty.toUpperCase()}
                        </span>
                      </div>

                      <p style={{
                        fontSize: '13px',
                        color: '#666',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        📅 {new Date(quiz.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>

                    {/* Card Stats */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '12px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px 0', fontWeight: '600' }}>
                          ⏱️ Time Limit
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#667eea', margin: 0 }}>
                          {quiz.time_limit}m
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px 0', fontWeight: '600' }}>
                          ❓ Questions
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#667eea', margin: 0 }}>
                          {quiz.num_questions}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px 0', fontWeight: '600' }}>
                          👥 Candidates
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#3498db', margin: 0 }}>
                          {quiz.num_candidates}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px 0', fontWeight: '600' }}>
                          ✅ Results
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#27ae60', margin: 0 }}>
                          {quiz.num_results}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <button
                        onClick={() => navigate(`/admin/questions/${quiz.id}`)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: '#667eea',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#764ba2';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#667eea';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        ❓ Questions
                      </button>
                      <button
                        onClick={() => navigate(`/admin/results/${quiz.id}`)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: '#27ae60',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#229954';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#27ae60';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        📊 Results
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
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
      `}</style>
    </div>
  );
}
