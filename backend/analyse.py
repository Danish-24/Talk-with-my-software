import os
from fastapi import FastAPI
from dotenv import load_dotenv
from pydantic import BaseModel
from PIL import ImageGrab,Image
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware


import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

IMAGE_PATH = "./images/screenshot.png"
SYSTEM_PROMPT = """
You are an expert software engineer.

You can understand:
- source code
- developer tools
- cloud consoles
- terminals
- desktop applications

Your job:
- Explain what is happening
- Answer user questions
- Explain visible errors
- Suggest fixes
- Teach concepts when useful

Keep answers practical and concise.
"""

BUG_PROMPT = """
You are a senior software engineer.

Analyze this screenshot carefully.

Look for:
- compiler errors
- stack traces
- warnings
- runtime failures
- broken UI
- suspicious code
- incorrect configuration

Explain:
1. What the problem is
2. Why it is happening
3. How to fix it

Be specific.
"""
conversation_history = []

print("Capturing screen...")

class QueryRequest(BaseModel):
    question: str

def capture_screen():
    screenshot = ImageGrab.grab()
    screenshot.save("./images/screenshot.png")
    screenshot.close()

def analyse_screen(user_req):
    capture_screen()
    image = Image.open(IMAGE_PATH)
    context = "\n".join(conversation_history[-5:])

    if user_req.lower() == "find bug":
        prompt = BUG_PROMPT
    else:
        prompt = SYSTEM_PROMPT
    full_prompt = f"""
        {prompt}

        Previous Conversation:
        {context}

        User Query:
        {user_req}
        """
    try:
        response = model.generate_content(
            [full_prompt, image]
        )
        answer = response.text
        image.close()
        conversation_history.append(f"User:{user_req}\nAssistant:{answer}")
    except Exception as e:
        answer = f"Model connection error{e}"
    return answer


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def check():
    return {
        "status":"running"
    }

@app.post("/analyse")
def analyse(request:QueryRequest):
    result = analyse_screen(request.question)

    return {
        "result":result
    }

@app.get("/screenshot")
def screen():
    capture_screen()
    return FileResponse(IMAGE_PATH,media_type="image/png")

