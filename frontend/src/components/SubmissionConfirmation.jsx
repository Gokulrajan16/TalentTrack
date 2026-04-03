import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubmissionConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="screen confirmation-screen">
      <div className="container">
        <div className="confirmation-box">
          <div className="checkmark">✓</div>
          <h1>Exam Submitted Successfully!</h1>
          
          <div className="message-box">
            <p className="large-text">Thank you for taking the exam.</p>
            <p className="info-text">
              You have completed the exam. For results, please contact the admin.
            </p>
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
