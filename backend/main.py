from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import base64
from datetime import datetime
from groq import Groq
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# -------------------- MODELS --------------------

class QuizRequest(BaseModel):
    num_questions: int
    difficulty: str
    subject: str

class SubmitRequest(BaseModel):
    questions: list
    responses: list

class ImageRequest(BaseModel):
    image: str

# -------------------- ROUTES --------------------

@app.post("/api/generate_quiz")
async def generate_quiz(data: QuizRequest):
    """Generate quiz questions using Groq."""
    prompt = f"""
Generate {data.num_questions} {data.difficulty} multiple choice questions on {data.subject}.

Return STRICT JSON ONLY.

Format:
[
  {{
    "q_id": 1,
    "question": "Question here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct_answer": "Option 1"
  }}
]

Rules:
- correct_answer must be the EXACT full text of one of the options
- No explanation
- No markdown
- No extra text
- Valid JSON only
"""
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": "You only return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )

        output = response.choices[0].message.content.strip()
        print("RAW OUTPUT:", output)

        # Clean JSON
        start = output.find("[")
        end = output.rfind("]") + 1
        clean_json = output[start:end]

        parsed = json.loads(clean_json)

        return {"questions": parsed, "success": True}

    except Exception as e:
        print("ERROR:", e)
        return {"questions": [], "success": False, "error": str(e)}

@app.post("/api/submit_quiz")
async def submit_quiz(data: SubmitRequest):
    """Evaluate quiz responses."""
    questions = data.questions
    responses = data.responses
    score = 0
    results = []
    total_questions = len(questions)

    for i, question in enumerate(questions):
        selected = responses[i] if i < len(responses) else None
        correct = question.get('correct_answer')

        is_correct = selected == correct

        if is_correct:
            score += 1

        results.append({
            "question": question,
            "correct_answers": [correct],
            "selected_options": [selected],
            "is_correct": is_correct
        })

    percentage = int((score / total_questions) * 100) if total_questions > 0 else 0

    return {
        "results": results,
        "correct_count": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "success": True
    }

@app.post("/api/capture_image")
async def capture_image(data: ImageRequest):
    """Capture and save image."""
    try:
        image_data = data.image
        
        # Decode base64 image
        image_data = image_data.split(",")[1]
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
        return {"message": str(e), "success": False}

@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
