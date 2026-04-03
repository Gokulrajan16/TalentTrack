from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import base64
from datetime import datetime, timedelta
from groq import Groq
import json
from dotenv import load_dotenv

try:
    from database import get_db, Admin, Quiz, Candidate, Result, engine, Base
    from auth import (
        hash_password, verify_password, create_token, decode_token,
        generate_candidate_credentials
    )
except ImportError:
    print("Error: database.py or auth.py not found. Creating them...")

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
except:
    print("Warning: Groq API key not set")

# Create tables
try:
    Base.metadata.create_all(bind=engine)
except:
    print("Warning: Could not create database tables")

# -------------------- MODELS --------------------

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminRegisterRequest(BaseModel):
    username: str
    password: str
    email: str

class QuizCreateRequest(BaseModel):
    topic: str
    difficulty: str
    time_limit: int
    num_questions: int
    num_candidates: int

class CandidateLoginRequest(BaseModel):
    username: str
    password: str

class GenerateQuizRequest(BaseModel):
    quiz_id: int

class SubmitRequest(BaseModel):
    questions: list
    responses: list
    candidate_id: int
    quiz_id: int

# -------------------- ADMIN ROUTES --------------------

@app.post("/api/admin/register")
async def admin_register(data: AdminRegisterRequest, db: Session = Depends(get_db)):
    """Register new admin"""
    existing = db.query(Admin).filter(Admin.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    admin = Admin(
        username=data.username,
        email=data.email,
        password=hash_password(data.password)
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    return {"success": True, "admin_id": admin.id}

@app.post("/api/admin/login")
async def admin_login(data: AdminLoginRequest, db: Session = Depends(get_db)):
    """Login admin"""
    admin = db.query(Admin).filter(Admin.username == data.username).first()
    
    if not admin or not verify_password(data.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token({"admin_id": admin.id, "type": "admin"})
    return {"success": True, "token": token, "admin_id": admin.id}

@app.post("/api/admin/create_quiz")
async def create_quiz(data: QuizCreateRequest, db: Session = Depends(get_db)):
    """Create quiz and generate candidate credentials"""
    try:
        quiz = Quiz(
            admin_id=1,
            topic=data.topic,
            difficulty=data.difficulty,
            time_limit=data.time_limit,
            num_questions=data.num_questions
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        
        # Generate candidate credentials
        credentials = []
        for i in range(data.num_candidates):
            username, password = generate_candidate_credentials(quiz.id, i + 1)
            candidate = Candidate(
                quiz_id=quiz.id,
                username=username,
                email=f"{username}@talenttrack.com",
                password=hash_password(password)
            )
            db.add(candidate)
            credentials.append({
                "username": username,
                "password": password,
                "email": f"{username}@talenttrack.com"
            })
        
        db.commit()
        
        return {
            "success": True,
            "quiz_id": quiz.id,
            "credentials": credentials
        }
    except Exception as e:
        print(f"Error creating quiz: {e}")
        return {"success": False, "error": str(e)}

@app.get("/api/admin/results/{quiz_id}")
async def get_results(quiz_id: int, db: Session = Depends(get_db)):
    """Get all results for a quiz"""
    try:
        results = db.query(Result).filter(Result.quiz_id == quiz_id).all()
        
        result_list = []
        for result in results:
            candidate = db.query(Candidate).filter(Candidate.id == result.candidate_id).first()
            result_list.append({
                "candidate_name": candidate.username if candidate else "Unknown",
                "score": result.score,
                "total_questions": result.total_questions,
                "percentage": result.percentage,
                "submitted_at": result.submitted_at.isoformat() if result.submitted_at else None
            })
        
        return {"results": result_list, "success": True}
    except Exception as e:
        print(f"Error getting results: {e}")
        return {"results": [], "error": str(e)}

# -------------------- CANDIDATE ROUTES --------------------

@app.post("/api/candidate/login")
async def candidate_login(data: CandidateLoginRequest, db: Session = Depends(get_db)):
    """Candidate login"""
    try:
        candidate = db.query(Candidate).filter(
            Candidate.username == data.username
        ).first()
        
        if not candidate or not verify_password(data.password, candidate.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        quiz = db.query(Quiz).filter(Quiz.id == candidate.quiz_id).first()
        
        token = create_token({
            "candidate_id": candidate.id,
            "quiz_id": candidate.quiz_id,
            "type": "candidate"
        })
        
        return {
            "success": True,
            "token": token,
            "candidate_id": candidate.id,
            "quiz_id": quiz.id,
            "topic": quiz.topic,
            "difficulty": quiz.difficulty,
            "time_limit": quiz.time_limit,
            "num_questions": quiz.num_questions
        }
    except Exception as e:
        print(f"Error during login: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/candidate/generate_quiz")
async def generate_quiz(data: GenerateQuizRequest, db: Session = Depends(get_db)):
    """Generate questions for candidate"""
    try:
        quiz = db.query(Quiz).filter(Quiz.id == data.quiz_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        prompt = f"""
Generate {quiz.num_questions} {quiz.difficulty} multiple choice questions on {quiz.topic}.

Return STRICT JSON ONLY in this exact format:
[
  {{
    "q_id": 1,
    "question": "Question here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct_answer": "Option 1"
  }}
]

Rules:
- correct_answer must be EXACT full text matching one of the options
- No explanations, markdown, or extra text
- Valid JSON only
"""
        
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",    
            messages=[
                {"role": "system", "content": "You only return valid JSON. No explanations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )
        
        output = response.choices[0].message.content.strip()
        print("Raw output:", output)
        
        # Extract JSON
        start = output.find("[")
        end = output.rfind("]") + 1
        if start >= 0 and end > start:
            clean_json = output[start:end]
        else:
            clean_json = output
            
        parsed = json.loads(clean_json)
        
        return {"questions": parsed, "success": True}
    
    except Exception as e:
        print(f"ERROR generating quiz: {e}")
        return {"questions": [], "success": False, "error": str(e)}

@app.post("/api/candidate/submit_quiz")
async def submit_quiz(data: SubmitRequest, db: Session = Depends(get_db)):
    """Submit candidate quiz"""
    try:
        questions = data.questions
        responses = data.responses
        score = 0
        total_questions = len(questions)
        
        for i, question in enumerate(questions):
            selected = responses[i] if i < len(responses) else None
            correct = question.get('correct_answer')
            if selected == correct:
                score += 1
        
        percentage = int((score / total_questions) * 100) if total_questions > 0 else 0
        
        result = Result(
            candidate_id=data.candidate_id,
            quiz_id=data.quiz_id,
            questions=questions,
            responses=responses,
            score=score,
            total_questions=total_questions,
            percentage=percentage
        )
        db.add(result)
        
        candidate = db.query(Candidate).filter(Candidate.id == data.candidate_id).first()
        if candidate:
            candidate.is_completed = True
        
        db.commit()
        
        return {
            "success": True,
            "score": score,
            "total_questions": total_questions,
            "percentage": percentage
        }
    except Exception as e:
        print(f"Error submitting quiz: {e}")
        return {"success": False, "error": str(e)}

@app.post("/api/capture_image")
async def capture_image(image: str):
    """Capture and save image"""
    try:
        image_data = image.split(",")[1]
        image_data = base64.b64decode(image_data)
        
        folder_path = 'captured_images'
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'{folder_path}/capture_{timestamp}.png'
        
        with open(filename, 'wb') as f:
            f.write(image_data)
        
        return {"message": "Image captured successfully!", "success": True}
    
    except Exception as e:
        print(f"Error capturing image: {e}")
        return {"message": str(e), "success": False}

@app.get("/api/health")
async def health():
    """Health check"""
    return {"status": "ok"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
