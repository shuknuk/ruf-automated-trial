import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    # Fallback or warning - for now we'll just print, but in prod we'd raise/log
    print("WARNING: GEMINI_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=API_KEY)

# Using Gemini 3 Flash as requested (or 2.5 if available via the same alias pointer, usually 'gemini-3-flash-preview' is the stable current flash model)
# If 3 Flash is strictly required and available, update the model name. 
# As of current kowledge, 'gemini-3-flash-preview' is the standard high-performance flash model.
MODEL_NAME = "gemini-3-flash-preview" 

def generate_answer(query: str, context: str) -> str:
    """
    Generates an answer using Gemini Flash based on the provided context.
    """
    if not API_KEY:
        return "System configuration error: API Key missing."

    model = genai.GenerativeModel(MODEL_NAME)
    
    # improved system prompt for "Spearfishing" RAG
    prompt = f"""
    You are an expert AI assistant for Rutgers University Finance and Administration (UFA).
    Your goal is to answer questions ACCURATELY based ONLY on the provided context from Rutgers Financial Policy documents.
    
    INSTRUCTIONS:
    1. Read the provided context carefully.
    2. Answer the user's question based strictly on the context.
    3. If the answer is found, CITE the specific section or page number if available in the text.
    4. If the answer is NOT in the context, say "I cannot find the answer in the provided policy documents."
    5. Maintain a professional, helpful tone.
    6. Provide the answer DIRECTLY. Do not include summaries, preambles, or conversational fillers (e.g., "Based on the policy...") unless necessary for clarity.
    
    CONTEXT:
    {context}
    
    USER QUESTION:
    {query}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating response: {str(e)}"
