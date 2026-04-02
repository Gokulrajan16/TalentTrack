import React, { useState } from 'react';

export default function HRScreen({ onGenerate }) {
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [subject, setSubject] = useState('Python');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(numQuestions, difficulty, subject);
  };

  return (
    <div className="screen hr-screen">
      <div className="container">
        <h1>TalentTrack - Quiz Generator</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="numQuestions">Number of Questions:</label>
            <input
              type="number"
              id="numQuestions"
              min="1"
              max="50"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Python, JavaScript, HTML"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Generate Quiz
          </button>
        </form>
      </div>
    </div>
  );
}
