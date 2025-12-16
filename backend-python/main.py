"""
FastAPI backend with Ollama integration for SimplifiED
Processes lecture transcriptions using local Ollama LLM
"""

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os
from dotenv import load_dotenv
import requests
import time
import json

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="SimplifiED Backend")

# Configure CORS - Allow frontend origins
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    FRONTEND_URL  # Production frontend URL from environment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Pydantic models
class LectureCreate(BaseModel):
    userId: str
    transcription: str

class LectureUpdate(BaseModel):
    transcription: str = None
    simpleText: str = None
    detailedSteps: str = None
    mindMap: str = None
    summary: str = None

# GROQ AI API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")  # Load from environment variable
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"  # Updated to current model

@app.get("/")
async def root():
    return {"message": "SimplifiED Backend with Grok AI", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "groq_model": GROQ_MODEL}

def chunk_text(text: str, max_chunk_size: int = 500) -> list:
    """Split text into smaller chunks for faster processing"""
    sentences = text.replace("?", ".").replace("!", ".").split(".")
    sentences = [s.strip() for s in sentences if s.strip()]
    
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        sentence_length = len(sentence)
        if current_length + sentence_length > max_chunk_size and current_chunk:
            chunks.append(". ".join(current_chunk) + ".")
            current_chunk = [sentence]
            current_length = sentence_length
        else:
            current_chunk.append(sentence)
            current_length += sentence_length
    
    if current_chunk:
        chunks.append(". ".join(current_chunk) + ".")
    
    return chunks

def generate_with_groq(prompt: str, system: str = None, stream: bool = False) -> str:
    """Generate text using GROQ AI with optimized settings"""
    try:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}"
        }
        
        payload = {
            "messages": messages,
            "model": GROQ_MODEL,
            "stream": stream,
            "temperature": 0.3,
            "max_tokens": 1000
        }
        
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
            print(f"❌ GROQ API Error {response.status_code}: {response.text}")
            raise HTTPException(status_code=500, detail=f"GROQ API error: {response.text}")
        
        data = response.json()
        return data['choices'][0]['message']['content']
        
    except requests.exceptions.RequestException as e:
        print(f"GROQ API error: {e}")
        raise HTTPException(status_code=500, detail=f"GROQ processing failed: {str(e)}")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"GROQ processing failed: {str(e)}")

@app.post("/api/lectures")
async def create_lecture(lecture: LectureCreate):
    """Create a new lecture with transcription"""
    try:
        lecture_data = {
            "userId": lecture.userId,
            "transcription": lecture.transcription,
            "simpleText": "",
            "detailedSteps": "",
            "mindMap": "",
            "summary": "",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        
        doc_ref = db.collection("lectures").document()
        doc_ref.set(lecture_data)
        
        return {"id": doc_ref.id, **lecture_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/lectures/{lecture_id}")
async def get_lecture(lecture_id: str):
    """Get a specific lecture"""
    try:
        doc = db.collection("lectures").document(lecture_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Lecture not found")
        
        data = doc.to_dict()
        return {"id": doc.id, **data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/lectures/user/{user_id}/latest")
async def get_latest_lecture(user_id: str):
    """Get the latest lecture for a user"""
    try:
        docs = db.collection("lectures")\
            .where("userId", "==", user_id)\
            .order_by("createdAt", direction=firestore.Query.DESCENDING)\
            .limit(1)\
            .stream()
        
        for doc in docs:
            data = doc.to_dict()
            return {"id": doc.id, **data}
        
        raise HTTPException(status_code=404, detail="No lectures found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/lectures/{lecture_id}/process")
async def process_lecture(lecture_id: str):
    """Process lecture transcription through Grok AI with chunking for faster processing"""
    try:
        # Get the lecture
        doc = db.collection("lectures").document(lecture_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Lecture not found")
        
        data = doc.to_dict()
        transcription = data.get("transcription", "")
        
        if not transcription:
            raise HTTPException(status_code=400, detail="No transcription to process")
        
        print(f"🚀 Processing lecture {lecture_id}...")
        start_time = time.time()
        
        # Chunk the transcription for faster processing
        chunks = chunk_text(transcription, max_chunk_size=600)
        print(f"📊 Split into {len(chunks)} chunks for processing")
        
        from concurrent.futures import ThreadPoolExecutor
        
        # ⚡ OPTIMIZED PROMPTS - SHORTER = FASTER
        breakdown_prompt = f"""Break down by splitting words into syllables with hyphens. Keep sentences intact.

Example: "Photosynthesis is the process" → "Pho-to-syn-the-sis is the pro-cess"

Text to process:
{transcription}

Output only the syllable breakdown, no explanations:"""
        
        steps_prompt = f"""Break this lecture into clear, numbered steps (max 5-7 steps). Each step should be concise and actionable.

Text:
{transcription}

Output only the numbered steps, no extra text:"""
        
        mindmap_prompt = f"""Create a brief mind map with main topic and 3-4 key points only.

Text:
{transcription}

Format:
Main Topic
├─ Point 1
├─ Point 2
└─ Point 3

Keep it short:"""
        
        summary_prompt = f"""Summarize in 2-3 sentences: main topic, key points, and conclusion.

Text:
{transcription}

Summary:"""
        
        print("⚙️ Starting parallel processing of 4 outputs...")
        
        # Use ThreadPoolExecutor for parallel processing (simpler, no asyncio issues)
        with ThreadPoolExecutor(max_workers=4) as executor:
            breakdown_future = executor.submit(
                generate_with_groq, 
                breakdown_prompt,
                "Break words into syllables. Output only the result."
            )
            steps_future = executor.submit(
                generate_with_groq,
                steps_prompt,
                "Create numbered steps. Be concise."
            )
            mindmap_future = executor.submit(
                generate_with_groq,
                mindmap_prompt,
                "Create a brief mind map. Keep it very short."
            )
            summary_future = executor.submit(
                generate_with_groq,
                summary_prompt,
                "Write a 2-3 sentence summary."
            )
            
            # Wait for all to complete
            breakdown_text = breakdown_future.result()
            detailed_steps = steps_future.result()
            mind_map = mindmap_future.result()
            summary = summary_future.result()
        
        elapsed_time = time.time() - start_time
        print(f"✅ Processing complete in {elapsed_time:.1f} seconds!")
        
        # Update Firestore
        update_data = {
            "simpleText": breakdown_text,
            "detailedSteps": detailed_steps,
            "mindMap": mind_map,
            "summary": summary,
            "updatedAt": datetime.now(),
            "processingTime": elapsed_time
        }
        
        db.collection("lectures").document(lecture_id).update(update_data)
        
        print("Done! Saved to Firestore.")
        return {
            "id": lecture_id,
            "simpleText": breakdown_text,
            "detailedSteps": detailed_steps,
            "mindMap": mind_map,
            "summary": summary,
            "processingTime": elapsed_time
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing lecture: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/lectures/{lecture_id}")
async def update_lecture(lecture_id: str, updates: LectureUpdate):
    """Update lecture fields"""
    try:
        update_data = {k: v for k, v in updates.dict().items() if v is not None}
        update_data["updatedAt"] = datetime.now()
        
        db.collection("lectures").document(lecture_id).update(update_data)
        
        doc = db.collection("lectures").document(lecture_id).get()
        data = doc.to_dict()
        return {"id": doc.id, **data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/lectures/{lecture_id}")
async def delete_lecture(lecture_id: str):
    """Delete a lecture"""
    try:
        db.collection("lectures").document(lecture_id).delete()
        return {"message": "Lecture deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/lectures/user/{user_id}")
async def get_user_lectures(user_id: str):
    """Get all lectures for a user"""
    try:
        docs = db.collection("lectures")\
            .where("userId", "==", user_id)\
            .order_by("createdAt", direction=firestore.Query.DESCENDING)\
            .stream()
        
        lectures = []
        for doc in docs:
            data = doc.to_dict()
            lectures.append({"id": doc.id, **data})
        
        return lectures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transcribe-audio")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file using AssemblyAI
    Requires ASSEMBLYAI_API_KEY in environment variables
    """
    try:
        # Get API key from environment
        api_key = os.getenv("ASSEMBLYAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, 
                detail="AssemblyAI API key not configured. Please add ASSEMBLYAI_API_KEY to .env file."
            )
        
        # Read file content
        file_content = await file.read()
        
        # Upload audio to AssemblyAI
        headers = {"authorization": api_key}
        upload_response = requests.post(
            "https://api.assemblyai.com/v2/upload",
            headers=headers,
            data=file_content
        )
        
        if upload_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to upload audio file")
        
        audio_url = upload_response.json()["upload_url"]
        
        # Request transcription
        transcript_request = {
            "audio_url": audio_url,
            "language_code": "en"
        }
        
        transcript_response = requests.post(
            "https://api.assemblyai.com/v2/transcript",
            headers=headers,
            json=transcript_request
        )
        
        if transcript_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to request transcription")
        
        transcript_id = transcript_response.json()["id"]
        
        # Poll for transcription completion
        polling_endpoint = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
        max_attempts = 60  # 5 minutes max
        attempt = 0
        
        while attempt < max_attempts:
            polling_response = requests.get(polling_endpoint, headers=headers)
            transcription_result = polling_response.json()
            
            if transcription_result["status"] == "completed":
                return {
                    "transcription": transcription_result["text"],
                    "confidence": transcription_result.get("confidence", 0),
                    "words": len(transcription_result["text"].split())
                }
            elif transcription_result["status"] == "error":
                raise HTTPException(
                    status_code=500, 
                    detail=f"Transcription failed: {transcription_result.get('error', 'Unknown error')}"
                )
            
            # Wait before polling again
            time.sleep(5)
            attempt += 1
        
        raise HTTPException(status_code=408, detail="Transcription timeout. Please try again.")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
