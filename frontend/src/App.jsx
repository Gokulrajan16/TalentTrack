import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import AdminCredentials from './components/AdminCredentials';
import AdminProfile from './components/AdminProfile';
import AdminResults from './components/AdminResults';
import AdminQuestions from './components/AdminQuestions';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import CandidateLogin from './components/CandidateLogin';
import CandidateScreen from './components/CandidateScreen';
import SubmissionConfirmation from './components/SubmissionConfirmation';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/dashboard/credentials/:quizId" element={<AdminCredentials />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/questions/:quizId" element={<AdminQuestions />} />
        <Route path="/admin/results/:quizId" element={<AdminResults />} />
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/quiz" element={<CandidateScreen />} />
        <Route path="/candidate/submission" element={<SubmissionConfirmation />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
