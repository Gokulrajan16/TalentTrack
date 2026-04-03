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
  const captureTimeoutRef = useRef(null);

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

    const handleBeforeUnload = () => {
      try { stopCamera(); } catch (e) { console.error('beforeunload stopCamera error', e); }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup: Stop camera when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopCamera();
    };
  }, [navigate]);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      if (streamRef.current) {
        console.log('startCamera: existing stream found, stopping it first');
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 } }
      });
      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        };
        
        videoRef.current.onplay = () => {
          console.log('Video playing successfully');
        };
        
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log('Video play started'))
            .catch(err => console.error('Play error:', err));
        }
      }

      // Auto-capture images every 5 seconds (start after 3 seconds to let video load)
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
        captureTimeoutRef.current = null;
      }
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
      captureTimeoutRef.current = setTimeout(() => {
        console.log('Starting capture interval...');
        captureIntervalRef.current = setInterval(() => {
          console.log('Capture triggered');
          captureImageInternal();
        }, 5000);
      }, 3000);

    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera. Please allow camera access. Error: ' + error.message);
    }
  };

  const stopCamera = () => {
    console.log('stopCamera: invoked');

    // Clear pending capture timeout
    if (captureTimeoutRef.current) {
      try {
        clearTimeout(captureTimeoutRef.current);
        console.log('stopCamera: cleared capture timeout');
      } catch (e) {
        console.error('stopCamera: error clearing timeout', e);
      }
      captureTimeoutRef.current = null;
    }

    // Clear capture interval
    if (captureIntervalRef.current) {
      try {
        clearInterval(captureIntervalRef.current);
        console.log('stopCamera: cleared capture interval');
      } catch (e) {
        console.error('stopCamera: error clearing interval', e);
      }
      captureIntervalRef.current = null;
    }

    // Stop tracks from streamRef or video.srcObject
    const stream = streamRef.current || (videoRef.current && videoRef.current.srcObject);
    if (stream && stream.getTracks) {
      try {
        const tracks = stream.getTracks();
        console.log('stopCamera: stopping tracks count=', tracks.length);
        tracks.forEach(track => {
          try {
            track.stop();
            console.log('stopCamera: stopped track', track.kind);
          } catch (err) {
            console.error('stopCamera: error stopping track', err);
          }
        });
      } catch (e) {
        console.error('stopCamera: error stopping tracks', e);
      }
    } else {
      console.log('stopCamera: no active stream to stop');
    }

    streamRef.current = null;

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        console.log('stopCamera: video paused and srcObject cleared');
      } catch (err) {
        console.error('stopCamera: error clearing video element', err);
      }
    }
  };

  const captureImageInternal = () => {
    console.log('=== Capture Function Called ===');
    console.log('videoRef.current:', videoRef.current);
    console.log('canvasRef.current:', canvasRef.current);
    console.log('streamRef.current:', streamRef.current);

    if (!videoRef.current) {
      console.error('❌ Video ref is null');
      return;
    }

    if (!canvasRef.current) {
      console.error('❌ Canvas ref is null');
      return;
    }

    try {
      const video = videoRef.current;
      console.log('Video readyState:', video.readyState, 'HAVE_ENOUGH_DATA:', video.HAVE_ENOUGH_DATA);
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

      // Check if video is ready to draw from
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        console.warn('⚠️ Video not ready. ReadyState:', video.readyState);
        return;
      }

      const canvas = canvasRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      console.log('Setting canvas to:', width, 'x', height);
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      if (!context) {
        console.error('❌ Could not get canvas context');
        return;
      }

      console.log('Drawing image to canvas...');
      context.drawImage(video, 0, 0, width, height);
      console.log('✓ Image drawn to canvas');

      const imageData = canvas.toDataURL('image/png');
      console.log('Image data generated, size:', imageData.length, 'bytes');

      // Send to backend
      console.log('Sending image to backend...');
      fetch('http://localhost:8000/api/capture_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      })
        .then(res => {
          console.log('Response status:', res.status);
          return res.json();
        })
        .then(data => {
          if (data.success) {
            console.log('✓ Image captured successfully:', data.filename);
          } else {
            console.error('❌ Capture failed:', data.message);
          }
        })
        .catch(err => {
          console.error('❌ Network error:', err);
        });
    } catch (error) {
      console.error('❌ Image capture error:', error);
      console.error('Stack:', error.stack);
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
    console.log('handleSubmit: stopping camera before submit');
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
          playsInline
          crossOrigin="anonymous"
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

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
