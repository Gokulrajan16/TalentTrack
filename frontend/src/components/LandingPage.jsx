import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1>TalentTrack</h1>
        <p className="subtitle">Quiz Management System</p>
        
        <div className="role-selection">
          <div className="role-card admin-card" onClick={() => navigate('/admin/login')}>
            <div className="role-icon">👨‍💼</div>
            <h2>Admin</h2>
            <p>Create quizzes, set questions, and manage candidates</p>
            <button className="btn btn-primary">Admin Login</button>
          </div>

          <div className="role-card candidate-card" onClick={() => navigate('/candidate/login')}>
            <div className="role-icon">👨‍🎓</div>
            <h2>Candidate</h2>
            <p>Take quizzes and view your results</p>
            <button className="btn btn-primary">Candidate Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
