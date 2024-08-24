from unittest import result
from flask import Flask, json, render_template, request, redirect, url_for, session, jsonify
from dotenv import load_dotenv
import os

import base64
from datetime import datetime
import google.generativeai as genai
import json

load_dotenv() 
app = Flask (__name__)

app.secret_key = 'your_secret_key'

# Configure Google Generative AI
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

@app.route('/')
def hr_screen():
    return render_template('hr_screen.html')


@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():

    print("from gen quiz** *", request)
    num_questions= request.form['num_questions']
    difficulty = request.form['difficulty']
    subject = request.form['subject']
    # Generate questions using Azure OpenAI
    questions = generate_questions (num_questions, difficulty, subject)
    session['questions'] = questions
    return redirect(url_for('candidate_screen'))

@app.route('/candidate')
def candidate_screen():
    questions=session.get('questions', [])
    print("questions from session***", questions)
    json_response=json.loads(questions)
    # return render_template('candidate_screen.html', questions json.loads(questions))
    return render_template('candidate.html', questions=json_response)


@app.route('/submit_quiz', methods=['GET'])
def submit_quiz():
    questions= session.get('questions', [])
    questions= json.loads(questions)
    responses = []
    for i in range(1, len (questions) + 1):
        response = request.args.get(f'question{i}') 
        responses.append(response)
    print("***********",responses)
        # Disable image capture after the exam is finished
    global capture_enabled
    capture_enabled = False
    return evaluate_responses (questions, responses)

#Function to get OpenAI response I
def generate_questions(num_questions, difficulty, subject):

    res_format="""
[
    {
    "q_id":1,
    "question": "What does HTML stand for?",
    "options": [
    "Hyper Text Markup Language", 
    "Home Tool Markup Language",
    "Hyperlinks and Text Markup Language",
    "High Text Markup Language"
    ],
    "correct answer": "Hyper Text Markup Language"
    }
    ]
    """

    prompt=f"""
    Generate {num_questions} {difficulty} questions on {subject} and updated new type of questions for each time. 
    Provide your output in this format {res_format}.
    Don't use unwanted Tags and quotation
    """

    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    print(response.text)
    return (response.text)
    # return(response_text) #return response.choices[0].message.content

def evaluate_responses (questions, responses):
    score = 0
    results = []
    correct_count = 0
    total_questions=0
    percentage=0
    
    print("Results from responses",responses)
    for i, question in enumerate(questions):
        selected_options = responses[i]
        correct_answers = question['correct answer']
        is_correct = selected_options == correct_answers
        total_questions+=1
        if is_correct:
            score += 1
            correct_count += 1

        results.append({
        "question": question,
        "correct_answers": [correct_answers], 
        "selected_options": [selected_options],
        "is_correct": is_correct
        })

    percentage= int((score/total_questions)*100) 
    print(percentage)

    return render_template('hr_results.html', results= results, correct_count=correct_count, selected_options=selected_options, total_questions=total_questions, percentage=percentage)

#Add a flag to control image capture
capture_enabled = True

@app.route('/capture_image', methods=['POST'])
def capture_image():

    if not capture_enabled: 
        return jsonify({"message": "Image capture is not available at this time."}), 403

    # Image capture logic here...
    image_data = request.json['image']

    # Decode the image data
    image_data = image_data.split(",")[1]
    image_data = base64.b64decode(image_data)

    # Create a directory if it doesn't exist
    folder_path = 'captured_images' 
    if not os.path.exists (folder_path): 
        os.makedirs (folder_path)

    # Save the image with a timestamp
    timestamp= datetime.now().strftime('%Y%m%d_%H%M%S') 
    image_filename = f'{folder_path}/capture_{timestamp}.png'
    with open(image_filename, 'wb') as image_file: 
        image_file.write(image_data)
    return jsonify({"message": "Image captured successfully!"})

if __name__ =='__main__':
    app.run(debug=True)