from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import ingest
import ai_service

app = FastAPI(title="Rutgers UFA Spearfishing Agent")

# Allow CORS for Next.js frontend
# In production on Vercel, we can allow all origins for the MVP, 
# or specific Vercel domains.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to hold context in memory
# In a real production app, this would be a vector db or efficient cache
POLICY_CONTEXT = ""

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
# We'll look for any PDF in data/ or a specific one
POLICY_FILE_PDF = os.path.join(DATA_DIR, "rutgers_policy.pdf")
POLICY_FILE_TXT = os.path.join(DATA_DIR, "rutgers_policy.txt")
POLICY_FILE_MD = os.path.join(DATA_DIR, "rutgers_policy.md")

@app.on_event("startup")
async def startup_event():
    """ Load policy data on startup """
    global POLICY_CONTEXT
    
    file_to_load = None
    if os.path.exists(POLICY_FILE_PDF):
        file_to_load = POLICY_FILE_PDF
        loader = ingest.load_pdf_text
    elif os.path.exists(POLICY_FILE_MD):
        file_to_load = POLICY_FILE_MD
        loader = ingest.load_txt_text
    elif os.path.exists(POLICY_FILE_TXT):
        file_to_load = POLICY_FILE_TXT
        loader = ingest.load_txt_text
        
    if file_to_load:
        print(f"Loading policy file: {file_to_load}")
        try:
            text = loader(file_to_load)
            POLICY_CONTEXT = text
            print(f"Loaded policy text ({len(text)} chars).")
        except Exception as e:
            print(f"Failed to load policy: {e}")
    else:
        print("No policy file found. System will answer broadly or fail until a file is added.")

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[str] = [] # Optional for MVP

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    global POLICY_CONTEXT
    
    if not POLICY_CONTEXT:
        # Fallback if no PDF loaded, maybe return a message asking to upload one
        # Or just use the AI without context if that was an option (but RAG is the goal)
        pass # We will still send it to AI, but maybe with empty context warning or just handle inside ai_service

    answer = ai_service.generate_answer(request.query, POLICY_CONTEXT)
    
    # For this MVP, we aren't doing granular source extraction in the python side yet, 
    # relying on the AI to cite in text.
    return ChatResponse(answer=answer, sources=[])

@app.get("/health")
def health_check():
    return {"status": "ok", "context_loaded": bool(POLICY_CONTEXT)}
