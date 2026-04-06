"""
Prompt templates for generating quiz questions based on difficulty levels and topics.
Each prompt is carefully crafted to generate diverse, engaging, and level-appropriate questions.
"""

def get_question_prompt(topic: str, difficulty: str, num_questions: int) -> str:
    """
    Generate a prompt for the Groq API based on topic and difficulty level.
    
    Args:
        topic: The subject/topic for the questions (e.g., "Python", "React", "Databases")
        difficulty: The difficulty level - "easy", "medium", or "hard"
        num_questions: Number of questions to generate
    
    Returns:
        A formatted prompt string for the Groq API
    """
    
    if difficulty.lower() == "easy":
        return get_easy_prompt(topic, num_questions)
    elif difficulty.lower() == "medium":
        return get_medium_prompt(topic, num_questions)
    elif difficulty.lower() == "hard":
        return get_hard_prompt(topic, num_questions)
    else:
        return get_easy_prompt(topic, num_questions)


def get_easy_prompt(topic: str, num_questions: int) -> str:
    """
    Generate easy level questions with tricky twists to confuse candidates.
    Focus on fundamental concepts with tricky wording and confusing options.
    """
    
    prompt = f"""
Generate exactly {num_questions} multiple choice questions about "{topic}" at EASY difficulty level.

IMPORTANT REQUIREMENTS:
1. Each question should cover DIFFERENT aspects of {topic}
2. Make questions TRICKY and TWISTY - candidates should get confused even on easy topics
3. Use confusing but technically correct options
4. The correct answer should be subtle and easy to miss
5. Include common misconceptions as wrong answers
6. Questions should test understanding, not just definitions

RESPONSE FORMAT (MUST FOLLOW EXACTLY):
For each question, provide EXACTLY in this format:
{{
  "question": "The question text here?",
  "options": [
    "Option A with tricky wording",
    "Option B that sounds correct but is wrong",
    "Option C that is partially correct",
    "Option D that is the correct answer"
  ],
  "correct_answer": "Option D that is the correct answer"
}}

INSTRUCTIONS:
- {num_questions} questions total
- All questions about {topic}
- Make options tricky and confusing
- Include subtle wording that can mislead
- Use common pitfalls as wrong answers
- Each question must be different and test different concepts

Generate the questions in JSON array format. Start directly with questions without any preamble.
"""
    
    return prompt


def get_medium_prompt(topic: str, num_questions: int) -> str:
    """
    Generate medium level scenario-based questions.
    NOT direct questions, but realistic scenarios that candidates must solve.
    """
    
    prompt = f"""
Generate exactly {num_questions} multiple choice questions about "{topic}" at MEDIUM difficulty level.

CRITICAL REQUIREMENTS:
1. Each question MUST be SCENARIO-BASED, NOT direct theoretical questions
2. Present real-world situations or code snippets where candidates apply knowledge
3. Generate DIFFERENT scenarios - each question should test different concepts
4. Make questions realistic and practical
5. Include nuanced options where multiple answers seem partially correct
6. Avoid repetition - each scenario should be unique

SCENARIO-BASED QUESTION EXAMPLES:
- "A developer is working on a project and encounters this problem... What's the best approach?"
- "Given this code snippet, what will be the output? Consider edge cases..."
- "A team needs to implement X feature. Which design pattern is most suitable?"
- "You're debugging this issue. What's the root cause?"

RESPONSE FORMAT (MUST FOLLOW EXACTLY):
For each question, provide EXACTLY in this format:
{{
  "question": "Scenario-based question text here?",
  "options": [
    "Option A - a reasonable but wrong approach",
    "Option B - another reasonable but incomplete solution",
    "Option C - best practice solution",
    "Option D - a plausible but inefficient approach"
  ],
  "correct_answer": "Option C - best practice solution"
}}

INSTRUCTIONS:
- {num_questions} questions total
- ALL questions MUST be scenario-based with realistic situations
- Include code snippets, business cases, or practical problems
- Options should represent different approaches (some partially correct)
- Correct answer is the best practice or optimal solution
- Each scenario should be unique and test different skills

Generate the questions in JSON array format. Start directly with questions without any preamble.
"""
    
    return prompt


def get_hard_prompt(topic: str, num_questions: int) -> str:
    """
    Generate hard level scenario-based questions.
    Complex scenarios with nuanced solutions and edge cases.
    """
    
    prompt = f"""
Generate exactly {num_questions} multiple choice questions about "{topic}" at HARD difficulty level.

CRITICAL REQUIREMENTS:
1. Each question MUST be SCENARIO-BASED with complex real-world situations
2. Present challenging scenarios requiring deep understanding
3. Include edge cases and corner cases in scenarios
4. Generate COMPLETELY DIFFERENT scenarios - no repetition
5. Make questions about advanced concepts and best practices
6. Options should represent different architectural or technical decisions
7. Include performance, scalability, and maintainability considerations

SCENARIO-BASED HARD QUESTION EXAMPLES:
- "In a high-traffic system handling X requests/second, which architecture would you choose?"
- "You're refactoring legacy code with this constraint... What's the optimal approach?"
- "Debug this complex multi-threaded code issue. What's the root cause?"
- "Given these performance metrics and constraints, which solution is best?"

RESPONSE FORMAT (MUST FOLLOW EXACTLY):
For each question, provide EXACTLY in this format:
{{
  "question": "Complex scenario-based question with edge cases?",
  "options": [
    "Option A - approach that fails in some edge case",
    "Option B - technically correct but poor performance",
    "Option C - optimal solution considering all factors",
    "Option D - approach that creates maintainability issues"
  ],
  "correct_answer": "Option C - optimal solution considering all factors"
}}

INSTRUCTIONS:
- {num_questions} questions total
- ALL questions MUST be complex scenario-based situations
- Include specific constraints, metrics, or requirements
- Consider performance, scalability, and code quality
- Options should represent different trade-offs
- Correct answer is the best overall solution
- Each scenario must be unique and advanced

Generate the questions in JSON array format. Start directly with questions without any preamble.
"""
    
    return prompt


def get_mixed_difficulty_questions_prompt(topic: str, easy_count: int, medium_count: int, hard_count: int) -> dict:
    """
    Get separate prompts for generating questions at different difficulty levels.
    
    Args:
        topic: The subject/topic
        easy_count: Number of easy questions
        medium_count: Number of medium questions
        hard_count: Number of hard questions
    
    Returns:
        Dictionary with prompts for each difficulty level
    """
    
    return {
        "easy": get_easy_prompt(topic, easy_count) if easy_count > 0 else None,
        "medium": get_medium_prompt(topic, medium_count) if medium_count > 0 else None,
        "hard": get_hard_prompt(topic, hard_count) if hard_count > 0 else None
    }


# Example usage instructions
"""
HOW TO USE:

1. For single difficulty level:
   from prompt import get_question_prompt
   
   prompt = get_question_prompt(
       topic="Python",
       difficulty="hard",
       num_questions=5
   )
   
   # Use prompt with Groq API

2. For mixed difficulty levels:
   from prompt import get_mixed_difficulty_questions_prompt
   
   prompts = get_mixed_difficulty_questions_prompt(
       topic="React",
       easy_count=2,
       medium_count=3,
       hard_count=2
   )
   
   # Call Groq API three times with different prompts

PROMPT CHARACTERISTICS:

EASY LEVEL:
- Tricky and confusing even for basic topics
- Focus on common misconceptions
- Subtle wording that can mislead
- Confusing but technically correct options

MEDIUM LEVEL:
- Scenario-based, realistic situations
- Code snippets or business cases
- Practical problem-solving
- Not direct theoretical questions
- Options represent different approaches

HARD LEVEL:
- Complex real-world scenarios
- Edge cases and corner cases
- Advanced concepts
- Performance and scalability considerations
- Architectural decisions and trade-offs
"""
