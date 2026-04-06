import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CandidateScreen() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const captureTimeoutRef = useRef(null);
  const cameraStoppedRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const submittingRef = useRef(false);

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
          
          // Get time limit from localStorage (set during login)
          const quizInfoStr = localStorage.getItem('quizInfo');
          if (quizInfoStr) {
            const quizInfo = JSON.parse(quizInfoStr);
            const totalSeconds = quizInfo.time_limit * 60;
            setTimeLimit(totalSeconds);
            setTimeRemaining(totalSeconds);
          }
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
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [navigate]);

  // Timer effect - starts countdown when time is set
  useEffect(() => {
    if (timeRemaining <= 0 || timeLimit === 0) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1 && !submittingRef.current) {
          // Time expired - trigger auto submit
          submittingRef.current = true;
          console.log('⏰ TIME EXPIRED - AUTO SUBMITTING QUIZ');
          // The submission will happen through a separate effect
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timeRemaining, timeLimit]);

  // Auto submit effect - when submittingRef is set
  useEffect(() => {
    if (!submittingRef.current || questions.length === 0) return;

    const performAutoSubmit = async () => {
      stopCamera();
      
      // Wait a moment to ensure camera fully stops
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const candidateId = parseInt(localStorage.getItem('candidateId'));
      const quizId = parseInt(localStorage.getItem('quizId'));
      
      // Convert responses object to array in question order
      const responseArray = questions.map(q => responses[q.q_id] || null);
      
      console.log('performAutoSubmit: proceeding with auto quiz submission');
      submitQuizInternal(responseArray, candidateId, quizId);
    };

    performAutoSubmit();
  }, [submittingRef.current]);

  const startCamera = async () => {
    // Don't restart if already stopped
    if (cameraStoppedRef.current) {
      console.log('startCamera: camera already stopped by submission, ignoring restart');
      return;
    }

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

      // Auto-capture images every 5 seconds (start after 5 seconds to let video load fully)
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
      }, 5000);

    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera. Please allow camera access. Error: ' + error.message);
    }
  };

  const stopCamera = () => {
    if (cameraStoppedRef.current) {
      console.log('stopCamera: already stopped, skipping');
      return;
    }

    console.log('stopCamera: ⋮ STARTING FULL CAMERA SHUTDOWN ⋮');
    cameraStoppedRef.current = true;

    // Clear pending capture timeout
    if (captureTimeoutRef.current) {
      try {
        clearTimeout(captureTimeoutRef.current);
        console.log('stopCamera: ✓ cleared capture timeout');
      } catch (e) {
        console.error('stopCamera: error clearing timeout', e);
      }
      captureTimeoutRef.current = null;
    }

    // Clear capture interval
    if (captureIntervalRef.current) {
      try {
        clearInterval(captureIntervalRef.current);
        console.log('stopCamera: ✓ cleared capture interval');
      } catch (e) {
        console.error('stopCamera: error clearing interval', e);
      }
      captureIntervalRef.current = null;
    }

    // Aggressively stop all tracks
    const stream = streamRef.current || (videoRef.current && videoRef.current.srcObject);
    if (stream && typeof stream.getTracks === 'function') {
      try {
        const tracks = stream.getTracks();
        console.log(`stopCamera: found ${tracks.length} tracks to stop`);
        tracks.forEach((track, idx) => {
          try {
            console.log(`stopCamera: stopping track[${idx}] kind=${track.kind} enabled=${track.enabled}`);
            track.enabled = false; // Disable first
            track.stop();           // Then stop
            console.log(`stopCamera: ✓ stopped track[${idx}]`);
          } catch (err) {
            console.error(`stopCamera: error stopping track[${idx}]`, err);
          }
        });
      } catch (e) {
        console.error('stopCamera: error getting/stopping tracks', e);
      }
    } else {
      console.log('stopCamera: no active stream to stop');
    }

    streamRef.current = null;

    // Clear video element
    if (videoRef.current) {
      try {
        console.log('stopCamera: stopping video element...');
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.srcObject = null;
        
        // Remove event listeners
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onplay = null;
        
        console.log('stopCamera: ✓ video element paused, cleared, and listeners removed');
      } catch (err) {
        console.error('stopCamera: error clearing video element', err);
      }
    }

    console.log('stopCamera: ⋮ CAMERA SHUTDOWN COMPLETE ⋮\n');
  };

  const captureImageInternal = () => {
    console.log('=== Capture Function Called ===');

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
      const canvas = canvasRef.current;

      // Log comprehensive video state
      console.log('Video state:', {
        readyState: video.readyState,
        paused: video.paused,
        seeking: video.seeking,
        duration: video.duration,
        currentTime: video.currentTime,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        networkState: video.networkState
      });

      // Check if video is actually playing with data
      if (video.paused) {
        console.warn('⚠️ Video is paused, skipping capture');
        return;
      }

      if (video.readyState < video.HAVE_CURRENT_FRAME) {
        console.warn('⚠️ Video not ready. ReadyState:', video.readyState, '(need at least', video.HAVE_CURRENT_FRAME, ')');
        return;
      }

      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      if (width === 0 || height === 0) {
        console.warn('⚠️ Video dimensions are 0, skipping capture');
        return;
      }

      console.log('✓ Video ready for capture, dimensions:', width, 'x', height);
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      if (!context) {
        console.error('❌ Could not get canvas context');
        return;
      }

      // Draw with white background first to detect if frame fails
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);

      // Now draw video frame
      try {
        console.log('Drawing video frame to canvas...');
        context.drawImage(video, 0, 0, width, height);
        console.log('✓ Frame drawn to canvas successfully');
      } catch (drawErr) {
        console.error('❌ Error drawing to canvas:', drawErr);
        return;
      }

      // Check if canvas actually has pixel data (not just white)
      const imageData = context.getImageData(0, 0, 1, 1);
      const pixelData = imageData.data;
      console.log('Canvas pixel sample [0,0]:', { r: pixelData[0], g: pixelData[1], b: pixelData[2], a: pixelData[3] });

      // Convert to base64
      let base64Data;
      try {
        base64Data = canvas.toDataURL('image/png');
        console.log('✓ Image data generated, size:', base64Data.length, 'bytes');

        // Validate it's not a tiny file (likely blank)
        if (base64Data.length < 1000) {
          console.warn('⚠️ Captured image is suspiciously small:', base64Data.length, 'bytes - likely blank image');
        }
      } catch (toDataErr) {
        console.error('❌ Error converting canvas to data URL:', toDataErr);
        return;
      }

      // Send to backend
      console.log('Sending image to backend...');
      fetch('http://localhost:8000/api/capture_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data })
      })
        .then(res => {
          console.log('Response status:', res.status);
          return res.json();
        })
        .then(data => {
          if (data.success) {
            console.log('✓ Image captured and saved:', data.filename);
          } else {
            console.error('❌ Backend capture failed:', data.message);
          }
        })
        .catch(err => {
          console.error('❌ Network error sending to backend:', err);
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

  const handleAutoSubmit = async () => {
    console.log('⏰ TIME EXPIRED - AUTO SUBMITTING QUIZ');
    
    stopCamera();
    
    // Wait a moment to ensure camera fully stops
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const candidateId = parseInt(localStorage.getItem('candidateId'));
    const quizId = parseInt(localStorage.getItem('quizId'));
    
    // Convert responses object to array in question order
    const responseArray = questions.map(q => responses[q.q_id] || null);
    
    console.log('handleAutoSubmit: proceeding with auto quiz submission');
    submitQuizInternal(responseArray, candidateId, quizId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('\n🎬 ============ QUIZ SUBMISSION STARTED ============ 🎬');
    console.log('handleSubmit: stopping camera...');
    stopCamera();
    
    // Wait a moment to ensure camera fully stops
    console.log('handleSubmit: waiting for camera to fully stop...');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('handleSubmit: ✓ camera stop process complete');
    
    const candidateId = parseInt(localStorage.getItem('candidateId'));
    const quizId = parseInt(localStorage.getItem('quizId'));
    
    // Convert responses object to array in question order
    const responseArray = questions.map(q => responses[q.q_id] || null);
    
    console.log('handleSubmit: proceeding with quiz submission');
    submitQuizInternal(responseArray, candidateId, quizId);
  };

  const submitQuizInternal = async (responseArray, candidateId, quizId) => {
    try {
      // Mark camera as intentionally stopped
      cameraStoppedRef.current = true;
      console.log('submitQuiz: marking camera as intentionally stopped');

      // Final safety check: ensure camera is stopped
      if (streamRef.current) {
        console.log('submitQuiz: force stopping any remaining streams');
        try {
          streamRef.current.getTracks().forEach(track => {
            try {
              track.enabled = false;
              track.stop();
              console.log('submitQuiz: stopped remaining track', track.kind);
            } catch (e) { }
          });
        } catch (e) { }
        streamRef.current = null;
      }

      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
        console.log('submitQuiz: cleared capture interval');
      }

      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
        captureTimeoutRef.current = null;
        console.log('submitQuiz: cleared capture timeout');
      }

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
        console.log('submitQuiz: ✓ quiz submitted successfully, navigating to submission page');
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

  // Format time remaining for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeRunningOut = timeRemaining > 0 && timeRemaining <= 300; // Last 5 minutes

  return (
    <div className="screen candidate-screen">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Quiz - Answer the Questions</h1>
          {timeLimit > 0 && (
            <div style={{
              padding: '10px 20px',
              backgroundColor: isTimeRunningOut ? '#e74c3c' : '#3498db',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        
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

        {/* Camera preview - visible in bottom right for debugging */}
        <video 
          ref={videoRef} 
          style={{ 
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '200px',
            height: '150px',
            borderRadius: '8px',
            border: '2px solid #3498db',
            backgroundColor: '#000',
            zIndex: 999
          }} 
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
