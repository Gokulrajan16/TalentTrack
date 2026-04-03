import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import AdminResults from './components/AdminResults';
import CandidateLogin from './components/CandidateLogin';
import CandidateScreen from './components/CandidateScreen';
import SubmissionConfirmation from './components/SubmissionConfirmation';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminDashboard />} />
        <Route path="/admin/results/:quizId" element={<AdminResults />} />
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/quiz" element={<CandidateScreen />} />
        <Route path="/candidate/submission" element={<SubmissionConfirmation />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
