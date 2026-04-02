import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import HRScreen from './components/HRScreen';
import CandidateScreen from './components/CandidateScreen';
import ResultsScreen from './components/ResultsScreen';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [screen, setScreen] = useState('hr'); // 'hr', 'candidate', 'results'
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async (numQuestions, difficulty, subject) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/generate_quiz`, {
        num_questions: parseInt(numQuestions),
        difficulty,
        subject
      });
      if (response.data.success) {
        setQuestions(response.data.questions || []);
        setScreen('candidate');
      } else {
        alert('Failed to generate quiz: ' + response.data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleSubmitQuiz = async (responses) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/submit_quiz`, {
        questions,
        responses
      });
      if (response.data.success) {
        setResults(response.data);
        setScreen('results');
      } else {
        alert('Failed to submit quiz');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleRestart = () => {
    setScreen('hr');
    setQuestions([]);
    setResults(null);
  };

  return (
    <div className="app">
      {loading && <div className="loading">Loading...</div>}
      {screen === 'hr' && <HRScreen onGenerate={handleGenerateQuiz} />}
      {screen === 'candidate' && (
        <CandidateScreen 
          questions={questions} 
          onSubmit={handleSubmitQuiz}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen 
          results={results} 
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
