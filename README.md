# Talk With My Software 🖥️

This repository contains a desktop-aware AI assistant that allows users to ask questions about whatever is currently visible on their screen. Built as a hands-on exploration of computer-vision-enabled LLMs, FastAPI, and React, the application captures a live screenshot, sends it to Google's Gemini model along with a user prompt, and returns context-aware explanations, debugging assistance, and recommendations.

## 🚀 Key Features

### Screenshot-Based Analysis

* Captures the current desktop using `PIL.ImageGrab`.
* Sends screenshots and user questions to Gemini 2.5 Flash.
* Maintains a rolling history of the last 5 conversations for contextual follow-ups.

### Custom AI Modes

* **General Assistant Mode** – Explains code, terminal output, cloud dashboards, and other on-screen content.
* **Bug Finder Mode** – Detects errors, stack traces, warnings, broken UI elements, and suggests fixes.

### React Front End

* Live screenshot preview.
* One-click actions: **Explain Screen**, **Find Bug**, and **What Should I Do Next?**
* Interactive chat interface with conversation history.

## 🛠️ Tech Stack

**Backend**

* FastAPI
* Pillow (`ImageGrab`)
* Google Gemini API
* python-dotenv

**Frontend**

* React 19
* Vite

## 🔌 API Endpoints

| Method | Endpoint      | Description                         |
| ------ | ------------- | ----------------------------------- |
| GET    | `/`           | Health check                        |
| POST   | `/analyse`    | Screenshot + question → AI response |
| GET    | `/screenshot` | Returns latest screenshot           |

## 💻 Running Locally

### Backend

```bash id="s4c6bg"
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-dotenv pydantic pillow google-generativeai

echo "GEMINI_API_KEY=your_api_key_here" > .env
mkdir images

uvicorn analyse:app --reload
```

### Frontend

```bash id="dtr6xr"
cd frontend
npm install
npm run dev
```

Once both servers are running, open the frontend and start asking questions about your screen.
