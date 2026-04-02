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
```

## Setup Instructions

### Backend (FastAPI)

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Create/update `.env` file in `backend/` with your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

3. Run FastAPI server:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend (React)

1. Install Node dependencies:
```bash
cd frontend
npm install
```

2. Update `.env` if needed (default is `http://localhost:8000`):
```
VITE_API_URL=http://localhost:8000
```

3. Run development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Features

- **Quiz Generation**: Generate custom quizzes with specified number of questions, difficulty, and subject
- **Real-time Quiz**: Take quizzes with multiple-choice questions
- **Image Capture**: Capture images during quiz (optional feature)
- **Results Display**: View detailed results with correct/incorrect answers and score percentage

## API Endpoints

### `POST /api/generate_quiz`
Generate quiz questions

**Request:**
```json
{
  "num_questions": 5,
  "difficulty": "medium",
  "subject": "Python"
}
```

**Response:**
```json
{
  "questions": [
    {
      "q_id": 1,
      "question": "What does HTML stand for?",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A"
    }
  ],
  "success": true
}
```

### `POST /api/submit_quiz`
Submit quiz responses and get results

**Request:**
```json
{
  "questions": [...],
  "responses": ["A", "B", "C", ...]
}
```

**Response:**
```json
{
  "results": [...],
  "correct_count": 4,
  "total_questions": 5,
  "percentage": 80,
  "success": true
}
```

### `POST /api/capture_image`
Capture and save an image

**Request:**
```json
{
  "image": "data:image/png;base64,..."
}
```

### `GET /api/health`
Health check

## Running Both Servers

### Option 1: Two Terminal Windows

Terminal 1 (Backend):
```bash
cd backend
python -m uvicorn main:app --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Option 2: Using npm-run-all (from root directory)

```bash
npm install -D npm-run-all
npm run start
```

Add this to root `package.json`:
```json
{
  "scripts": {
    "start": "npm-run-all --parallel backend:start frontend:start",
    "backend:start": "cd backend && python -m uvicorn main:app --reload",
    "frontend:start": "cd frontend && npm run dev"
  }
}
```

## Environment Variables

### Backend (.env in backend/)
- `GROQ_API_KEY`: Your Groq API key for question generation

### Frontend (.env in frontend/)
- `VITE_API_URL`: FastAPI backend URL (default: http://localhost:8000)

## Building for Production

### Backend
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

**"No questions available"**
- Check that Groq API key is valid in `.env`
- Verify FastAPI server is running at `http://localhost:8000`
- Check browser console for errors

**CORS Errors**
- FastAPI CORS is configured to allow all origins in development
- For production, update CORS settings in backend/main.py

**Port Already in Use**
- Backend: Change port in uvicorn command (--port 8000)
- Frontend: Change port in vite.config.js (port: 3000)

## License

MIT
