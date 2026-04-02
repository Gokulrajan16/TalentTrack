# TalentTrack - Quiz System

A React + FastAPI quiz system that uses Groq AI to generate quiz questions.

## Project Structure

```
TalentTrack/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   ├── index.css        # Global styles
│   │   └── components/
│   │       ├── HRScreen.jsx         # Quiz setup
│   │       ├── CandidateScreen.jsx  # Quiz taking
│   │       └── ResultsScreen.jsx    # Results display
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── .env                 # Environment variables
└── README.md                # This file