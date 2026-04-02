import React from 'react';

export default function ResultsScreen({ results, onRestart }) {
  if (!results) {
    return <div className="screen">No results.</div>;
  }

  return (
    <div className="screen results-screen">
      <div className="container">
        <h1>Quiz Results</h1>
        
        <div className="results-summary">
          <div className="score-card">
            <h2>Score: {results.correct_count}/{results.total_questions}</h2>
            <p className="percentage">{results.percentage}%</p>
          </div>
        </div>

        <div className="results-list">
          {results.results.map((result, index) => (
            <div
              key={index}
              className={`result-item ${result.is_correct ? 'correct' : 'incorrect'}`}
            >
              <h4>Question {index + 1}: {result.question.question}</h4>
              <p>
                <strong>Your Answer:</strong> {result.selected_options[0] || 'Not answered'}
              </p>
              <p>
                <strong>Correct Answer:</strong> {result.correct_answers[0]}
              </p>
              <p className={result.is_correct ? 'text-success' : 'text-error'}>
                {result.is_correct ? '✓ Correct' : '✗ Incorrect'}
              </p>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" onClick={onRestart}>
          Start New Quiz
        </button>
      </div>
    </div>
  );
}
