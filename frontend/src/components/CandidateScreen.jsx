import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CandidateScreen() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  // Fetch questions and start camera on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const quizId = localStorage.getItem('quizId');
        const candidateId = localStorage.getItem('candidateId');
        
        if (!quizId || !candidateId) {
          setError('Missing quiz or candidate information');
          navigate('/candidate/login');
          return;
        }

        const response = await fetch('http://localhost:8000/api/candidate/generate_quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quiz_id: parseInt(quizId) })
        });

        const data = await response.json();
        if (data.success && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setError('Failed to load questions: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        setError('Error loading questions: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    startCamera();

    // Cleanup: Stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Auto-capture images every 5 seconds
      captureIntervalRef.current = setInterval(() => {
        captureImageInternal();
      }, 5000);

    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera. Please allow camera access.');
    }
  };

  const stopCamera = () => {
    // Clear capture interval
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImageInternal = () => {
    if (videoRef.current && canvasRef.current && streamRef.current) {
      try {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/png');
        
        // Send to backend
        fetch('http://localhost:8000/api/capture_image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData })
        }).catch(err => console.error('Image upload error:', err));
      } catch (error) {
        console.error('Image capture error:', error);
      }
    }
  };

  const handleOptionChange = (qId, option) => {
    setResponses({
      ...responses,
      [qId]: option
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Stop camera when quiz is submitted
    stopCamera();
    
    const candidateId = parseInt(localStorage.getItem('candidateId'));
    const quizId = parseInt(localStorage.getItem('quizId'));
    
    // Convert responses object to array in question order
    const responseArray = questions.map(q => responses[q.q_id] || null);
    
    submitQuiz(responseArray, candidateId, quizId);
  };

  const submitQuiz = async (responseArray, candidateId, quizId) => {
    try {
      const response = await fetch('http://localhost:8000/api/candidate/submit_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          responses: responseArray,
          candidate_id: candidateId,
          quiz_id: quizId
        })
      });

      const data = await response.json();
      if (data.success) {
        navigate('/candidate/submission', { state: { result: data } });
      } else {
        alert('Error submitting quiz: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="screen">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h1>Loading Questions...</h1>
            <p>Please wait while we prepare your quiz.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
            <h1>Error</h1>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="screen">
        <div className="container">
          <h1>No Questions Available</h1>
          <p>Please try again later or contact your administrator.</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="screen candidate-screen">
      <div className="container">
        <h1>Quiz - Answer the Questions</h1>
        
        {/* Question Progress */}
        <div className="progress-bar">
          <div className="progress-info">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Hidden camera - running in background */}
        <video 
          ref={videoRef} 
          style={{ display: 'none' }} 
          autoPlay
          muted
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />

        {/* Current Question */}
        <div className="question-display">
          <div className="question-block">
            <h3>{currentQuestion.question}</h3>
            
            <div className="options">
              {currentQuestion.options.map((option, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name={`q_${currentQuestion.q_id}`}
                    value={option}
                    checked={responses[currentQuestion.q_id] === option}
                    onChange={() => handleOptionChange(currentQuestion.q_id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
            >
              ← Previous
            </button>

            {isLastQuestion ? (
              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Submit Quiz ✓
              </button>
            ) : (
              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
