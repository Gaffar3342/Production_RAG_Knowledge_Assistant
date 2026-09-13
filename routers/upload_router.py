import logging

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from config import get_settings
from schemas.upload_schema import DocumentSummary, DocumentUploadResponse
from services import document_repository
from services.exceptions import DuplicateDocumentError, InvalidDocumentError
from services.ingestion_service import process_document


logger = logging.getLogger(__name__)
router = APIRouter(tags=["documents"])


@router.post("/upload", response_model=DocumentUploadResponse, status_code=201)
async def upload_document(file: UploadFile = File(...)) -> DocumentUploadResponse:
    settings = get_settings()
    content = await file.read(settings.max_upload_size_bytes + 1)
    if len(content) > settings.max_upload_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"PDF files must be at most {settings.max_upload_size_mb} MB.",
        )

    try:
        return await run_in_threadpool(process_document, file.filename or "upload.pdf", content)
    except DuplicateDocumentError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    except InvalidDocumentError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except Exception as error:
        logger.exception("Document ingestion failed")
        raise HTTPException(status_code=500, detail="Document processing failed. Please try again.") from error


@router.get("/documents", response_model=list[DocumentSummary])
def get_documents() -> list[dict]:
    document_repository.initialize_database()
    return document_repository.list_documents()
