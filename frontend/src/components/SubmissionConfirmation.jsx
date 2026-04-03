import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SubmissionConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="screen">
        <div className="container">
          <h1>Error</h1>
          <p>No submission data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen confirmation-screen">
      <div className="container">
        <div className="confirmation-box">
          <div className="checkmark">✓</div>
          <h1>Exam Submitted Successfully!</h1>
          
          <div className="message-box">
            <p className="large-text">Thank you for taking the exam.</p>
            <p className="info-text">
              Your responses have been recorded. Our admin will contact you with the results shortly.
            </p>
          </div>

          <div className="submission-details">
            <h2>Submission Details</h2>
            <div className="detail-row">
              <span className="label">Score:</span>
              <span className="value">{result.score}/{result.total_questions}</span>
            </div>
            <div className="detail-row">
              <span className="label">Percentage:</span>
              <span className="value">{result.percentage}%</span>
            </div>
            <div className="detail-row">
              <span className="label">Submitted At:</span>
              <span className="value">{new Date().toLocaleString()}</span>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
