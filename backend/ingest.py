import os
from pypdf import PdfReader
from typing import List

def load_pdf_text(pdf_path: str) -> str:
    """
    Loads text from a PDF file.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at {pdf_path}")
    
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def load_txt_text(txt_path: str) -> str:
    """
    Loads text from a .txt file.
    """
    if not os.path.exists(txt_path):
        raise FileNotFoundError(f"Text file not found at {txt_path}")
    
    with open(txt_path, "r", encoding="utf-8") as f:
        return f.read()

def chunk_text(text: str, chunk_size: int = 10000) -> List[str]:
    """
    Splits text into larger chunks. 
    Since we are using Gemini 1.5/2.5 Flash with a massive context window,
    we can afford larger chunks or even the whole document if it's not absolutely massive.
    For this MVP, we will try to keep it simple and just return the whole text as one 'context' 
    unless it's exceedingly large, but having a chunker is good practice.
    """
    # Simple character-based chunking for now so as not to break words too badly
    # In a prod system, we'd use a proper tokenizer or recursive splitter
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks

if __name__ == "__main__":
    # Test
    # text = load_pdf_text("../data/sample.pdf")
    # print(text[:500])
    pass
