import logging

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from schemas.upload_schema import ChatRequest, ChatResponse, SourceCitation
from services.ai_services import generate_answer
from services.document_repository import has_documents, initialize_database
from services.exceptions import KnowledgeBaseEmptyError
from services.pdf_services import create_query_embedding
from vector_store.chroma_store import search_similar


logger = logging.getLogger(__name__)
router = APIRouter(tags=["chat"])


def _answer_question(question: str) -> ChatResponse:
    initialize_database()
    if not has_documents():
        raise KnowledgeBaseEmptyError

    retrieved_chunks = search_similar(create_query_embedding(question))
    if not retrieved_chunks:
        raise LookupError("No matching evidence was found.")

    context = "\n\n".join(
        f"[Source: {chunk.filename}, page {chunk.page_number}, chunk {chunk.chunk_id}]\n{chunk.text}"
        for chunk in retrieved_chunks
    )
    generated = generate_answer(question, context)
    return ChatResponse(
        answer=generated.answer,
        confidence=generated.confidence,
        sources=[
            SourceCitation(
                document_id=chunk.document_id,
                filename=chunk.filename,
                page_number=chunk.page_number,
                chunk_id=chunk.chunk_id,
                excerpt=chunk.text[:500],
                relevance=chunk.relevance,
            )
            for chunk in retrieved_chunks
        ],
    )


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        return await run_in_threadpool(_answer_question, request.question)
    except KnowledgeBaseEmptyError as error:
        raise HTTPException(status_code=409, detail="Upload at least one document before asking a question.") from error
    except LookupError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except Exception as error:
        logger.exception("Chat request failed")
        raise HTTPException(status_code=500, detail="Could not answer the question. Please try again.") from error
