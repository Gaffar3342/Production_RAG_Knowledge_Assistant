from fastapi import APIRouter
from schemas.upload_schema import ChatRequest
from vector_store.chroma_db.chroma_dbase import search_similar
from services.pdf_services import create_query_embedding
from services.ai_services import generate_answer
router=APIRouter()
@router.post("/chat")
def chat(request:ChatRequest):
    question_embedding=create_query_embedding(request.question)
    results=search_similar(question_embedding)
    context="\n\n".join(results["documents"][0])
    answer=generate_answer(context=context,question=request.question)
    return {"answer":answer}