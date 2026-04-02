from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from dotenv import load_dotenv
import os
import base64
from datetime import datetime
from groq import Groq
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Configure Groq
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Flag to control image capture
capture_enabled = True


# -------------------- ROUTES --------------------

@app.route('/')
def hr_screen():
    return render_template('hr_screen.html')


@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    num_questions = request.form['num_questions']
    difficulty = request.form['difficulty']
    subject = request.form['subject']

    questions = generate_questions(num_questions, difficulty, subject)

    # Store raw string
    session['questions'] = questions

    return redirect(url_for('candidate_screen'))


@app.route('/candidate')
def candidate_screen():
    questions = session.get('questions', '[]')

    try:
        json_response = json.loads(questions)

        # 🔥 Ensure proper indexing
        for i, q in enumerate(json_response):
            q['q_id'] = i + 1

    except:
        json_response = []

    return render_template('candidate.html', questions=json_response)


@app.route('/submit_quiz', methods=['GET'])
def submit_quiz():
    global capture_enabled

    questions = session.get('questions', '[]')

    try:
        questions = json.loads(questions)
    except:
        questions = []

    responses = []

    for i in range(1, len(questions) + 1):
        response = request.args.get(f'question{i}')
        responses.append(response)

    # Disable image capture after exam
    capture_enabled = False

    return evaluate_responses(questions, responses)


# -------------------- GROQ FUNCTION --------------------

def generate_questions(num_questions, difficulty, subject):

    prompt = f"""
Generate {num_questions} {difficulty} multiple choice questions on {subject}.

Return STRICT JSON ONLY.

Format:
[
  {{
    "q_id": 1,
    "question": "Question here?",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "A"
  }}
]

Rules:
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

        # 🔥 CLEAN JSON (IMPORTANT)
        start = output.find("[")
        end = output.rfind("]") + 1
        clean_json = output[start:end]

        parsed = json.loads(clean_json)

        return json.dumps(parsed)

    except Exception as e:
        print("ERROR:", e)
        return json.dumps([])


# -------------------- EVALUATION --------------------

def evaluate_responses(questions, responses):
    score = 0
    results = []
    total_questions = len(questions)

    for i, question in enumerate(questions):
        selected = responses[i]
        correct = question.get('correct answer')

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

    return render_template(
        'hr_results.html',
        results=results,
        correct_count=score,
        total_questions=total_questions,
        percentage=percentage
    )


# -------------------- IMAGE CAPTURE --------------------

@app.route('/capture_image', methods=['POST'])
def capture_image():
    global capture_enabled

    if not capture_enabled:
        return jsonify({"message": "Image capture is disabled."}), 403

    image_data = request.json['image']

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

    return jsonify({"message": "Image captured successfully!"})


# -------------------- MAIN --------------------

if __name__ == '__main__':
    app.run(debug=True)