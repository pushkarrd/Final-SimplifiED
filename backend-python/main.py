"""
FastAPI backend with Gemini AI integration for SimplifiED
Processes lecture transcriptions using Google Gemini API
"""

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
from datetime import datetime
import os
from dotenv import load_dotenv
import requests
import time

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="SimplifiED Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✓ Firebase initialized successfully")
except FileNotFoundError:
    print("⚠ WARNING: serviceAccountKey.json not found!")
    print("To get this file:")
    print("1. Go to Firebase Console: https://console.firebase.google.com/")
    print("2. Select your project")
    print("3. Go to Project Settings > Service Accounts")
    print("4. Click 'Generate New Private Key'")
    print("5. Save the file as 'serviceAccountKey.json' in the backend-python folder")
    print("\nFirebase features will not work without this file.")
    db = None
except Exception as e:
    print(f"⚠ WARNING: Firebase initialization failed: {e}")
    db = None

# Initialize Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("⚠ WARNING: GEMINI_API_KEY not found in environment variables!")
    print("Please add your Gemini API key to the .env file")
    print("Get your API key from: https://aistudio.google.com/app/apikey")
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        print("✓ Gemini API initialized successfully")
    except Exception as e:
        print(f"⚠ WARNING: Gemini API initialization failed: {e}")

# Gemini model configuration
GEMINI_MODEL = "models/gemini-2.5-flash"
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}

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

@app.get("/")
async def root():
    return {"message": "SimplifiED Backend with Gemini AI", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "gemini_model": GEMINI_MODEL}

def generate_with_gemini(prompt: str, system: str = None) -> str:
    """Generate text using Gemini API"""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="Gemini API key not configured. Please add GEMINI_API_KEY to .env file")
    try:
        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            generation_config=generation_config,
        )
        
        # Combine system prompt with user prompt if system is provided
        full_prompt = f"{system}\n\n{prompt}" if system else prompt
        
        print(f"Generating with Gemini model: {GEMINI_MODEL}")
        response = model.generate_content(full_prompt)
        print(f"Response received successfully")
        return response.text
    except Exception as e:
        print(f"Gemini error details: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gemini processing failed: {str(e)}")

@app.post("/api/lectures")
async def create_lecture(lecture: LectureCreate):
    """Create a new lecture with transcription"""
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase not initialized. Please configure serviceAccountKey.json")
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
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase not initialized. Please configure serviceAccountKey.json")
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
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase not initialized. Please configure serviceAccountKey.json")
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
    """Process lecture transcription through Gemini AI to generate all outputs in parallel"""
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase not initialized. Please configure serviceAccountKey.json")
    try:
        # Get the lecture
        doc = db.collection("lectures").document(lecture_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Lecture not found")
        
        data = doc.to_dict()
        transcription = data.get("transcription", "")
        
        if not transcription:
            raise HTTPException(status_code=400, detail="No transcription to process")
        
        print(f"Processing lecture {lecture_id} in parallel...")
        
        # Import asyncio for parallel processing
        import asyncio
        from concurrent.futures import ThreadPoolExecutor
        
        # Define all prompts
        breakdown_prompt = f"""Break down this text by splitting EVERY word into syllables using hyphens. Keep the sentence structure intact.

Example: "Photosynthesis is the process" → "Pho-to-syn-the-sis is the pro-cess"

Rules:
- Split EVERY word into syllables with hyphens
- Keep punctuation and capitalization
- Maintain the original sentence flow
- Short words (1-2 syllables) can stay as is if obvious

Transcription: {transcription}

Syllable breakdown:"""
        
        steps_prompt = f"""Break down this lecture into clear, numbered steps. Each step should be action-oriented, easy to follow, and in logical order. Keep it concise.

Transcription: {transcription}

Step-by-step breakdown:"""
        
        mindmap_prompt = f"""Create a BRIEF text-based mind map. Use ONLY the most important points:

Main Topic
├─ Key Point 1
├─ Key Point 2
└─ Key Point 3

Keep it SHORT - maximum 5-7 points total. Be concise.

Transcription: {transcription}

Brief mind map:"""
        
        summary_prompt = f"""Provide a concise 3-4 sentence summary with main topic, key points, and conclusion.

Transcription: {transcription}

Summary:"""
        
        # Function to run Gemini in thread pool
        def generate_async(prompt: str, system: str):
            return generate_with_gemini(prompt, system)
        
        # Execute all 4 prompts in parallel using ThreadPoolExecutor
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor(max_workers=4) as executor:
            tasks = [
                loop.run_in_executor(executor, generate_async, breakdown_prompt, 
                    "You are an expert in breaking words into syllables for reading assistance."),
                loop.run_in_executor(executor, generate_async, steps_prompt,
                    "You are an expert educator who creates clear, sequential learning materials."),
                loop.run_in_executor(executor, generate_async, mindmap_prompt,
                    "You are an expert in creating brief, focused mind maps. Be extremely concise."),
                loop.run_in_executor(executor, generate_async, summary_prompt,
                    "You are an expert in creating clear, concise academic summaries.")
            ]
            
            results = await asyncio.gather(*tasks)
            breakdown_text, detailed_steps, mind_map, summary = results
        
        print("All processing complete! Updating Firestore...")
        
        # Update Firestore
        update_data = {
            "simpleText": breakdown_text,
            "detailedSteps": detailed_steps,
            "mindMap": mind_map,
            "summary": summary,
            "updatedAt": datetime.now()
        }
        
        db.collection("lectures").document(lecture_id).update(update_data)
        
        print("Done!")
        return {
            "id": lecture_id,
            "simpleText": breakdown_text,
            "detailedSteps": detailed_steps,
            "mindMap": mind_map,
            "summary": summary
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing lecture: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/lectures/{lecture_id}")
async def update_lecture(lecture_id: str, updates: LectureUpdate):
    """Update lecture fields"""
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase not initialized. Please configure serviceAccountKey.json")
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
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase not initialized. Please configure serviceAccountKey.json")
    try:
        db.collection("lectures").document(lecture_id).delete()
        return {"message": "Lecture deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/lectures/user/{user_id}")
async def get_user_lectures(user_id: str):
    """Get all lectures for a user"""
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase not initialized. Please configure serviceAccountKey.json")
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
