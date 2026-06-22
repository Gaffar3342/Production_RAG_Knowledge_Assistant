from pypdf import PdfReader
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()
def extract_text(pdf_path:str)->str:
    reader=PdfReader(pdf_path)
    full_text=""
    for page in reader.pages:
        text=page.extract_text()+"\n"
        full_text+=text
    return full_text
def chunk_text(text:str,chunksize=200,overlop=50):
    chunks=[]
    start=0
    while start<len(text):
        end=start+chunksize
        chunk=text[start:end]
        chunks.append(chunk)
        start=start+chunksize-overlop
    return chunks
client=OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def create_embedding(chunks:list[str])->list[list[float]]:
    response=client.embeddings.create(
        model="text-embedding-3-small",
        input=chunks
    )
    embeddings=[]
    for item in response.data:
        embeddings.append(item.embedding)    
    return embeddings
def create_query_embedding(question: str) -> list[float]:
    response=client.embeddings.create(
        model="text-embedding-3-small",
        input=question
    )
    embeddings=[]
    for item in response.data:
        embeddings.append(item.embedding)    
    return embeddings