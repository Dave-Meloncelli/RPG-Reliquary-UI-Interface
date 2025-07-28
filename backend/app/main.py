from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import httpx

from .database import get_db, init_db
from . import crud, schemas

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI(title="AZ Interface API", version="1.0.0")


@app.on_event("startup")
def on_startup():
    """Initialize database tables."""
    init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class HealthResponse(BaseModel):
    status: str
    message: str

class GeminiTextRequest(BaseModel):
    prompt: Optional[str] = None
    contents: Optional[dict | list] = None
    config: Optional[dict] = None

class GeminiTextResponse(BaseModel):
    text: str

class GeminiImageRequest(BaseModel):
    prompt: str

class GeminiImageResponse(BaseModel):
    imageDataUrl: str


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy", message="AZ Interface API is running")

# Task endpoints backed by the database
@app.get("/tasks", response_model=List[schemas.Task])
def get_tasks(db: Session = Depends(get_db)):
    return crud.get_tasks(db)


@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task)


@app.get("/tasks/{task_id}", response_model=schemas.Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@app.post("/gemini/text", response_model=GeminiTextResponse)
async def gemini_text(req: GeminiTextRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    params = {"key": GEMINI_API_KEY}
    payload = {}
    if req.prompt is not None:
        payload["contents"] = req.prompt
    elif req.contents is not None:
        payload["contents"] = req.contents
    if req.config:
        payload["generationConfig"] = req.config
    async with httpx.AsyncClient() as client:
        res = await client.post(url, params=params, json=payload)
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Gemini API request failed")
    data = res.json()
    text = data.get("text")
    if not text:
        cand = data.get("candidates", [{}])[0]
        parts = cand.get("content", {}).get("parts", [])
        text = "".join(p.get("text", "") for p in parts)
    return GeminiTextResponse(text=text)


@app.post("/gemini/image", response_model=GeminiImageResponse)
async def gemini_image(req: GeminiImageRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    url = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages"
    params = {"key": GEMINI_API_KEY}
    payload = {"prompt": req.prompt, "numImages": 1}
    async with httpx.AsyncClient() as client:
        res = await client.post(url, params=params, json=payload)
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Gemini API request failed")
    data = res.json()
    try:
        img = data["generatedImages"][0]["image"]["imageBytes"]
    except Exception:
        img = ""
    return GeminiImageResponse(imageDataUrl=f"data:image/jpeg;base64,{img}")


@app.post("/gemini/vision")
async def gemini_vision(payload: dict):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    params = {"key": GEMINI_API_KEY}
    data = {
        "contents": {
            "parts": [
                {"text": "Analyze this RPG book cover image and extract information in JSON format."},
                {"inlineData": payload}
            ]
        },
        "generationConfig": {"responseMimeType": "application/json"}
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, params=params, json=data)
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Gemini API request failed")
    return res.json()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
