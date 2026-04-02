import React, { useState, useRef, useEffect } from 'react';

export default function CandidateScreen({ questions, onSubmit }) {
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  // Start camera automatically on component mount
  useEffect(() => {
    startCamera();

    // Cleanup: Stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

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
    
    // Convert responses object to array in question order
    const responseArray = questions.map(q => responses[q.q_id] || null);
    onSubmit(responseArray);
  };

  if (!questions || questions.length === 0) {
    return <div className="screen">No questions available.</div>;
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
