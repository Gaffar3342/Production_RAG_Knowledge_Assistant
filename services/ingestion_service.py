import hashlib
from pathlib import Path
from uuid import uuid4

from config import get_settings
from schemas.upload_schema import DocumentUploadResponse
from services import document_repository
from services.exceptions import DuplicateDocumentError, InvalidDocumentError
from services.pdf_services import chunk_pages, create_embeddings, extract_pages
from vector_store.chroma_store import delete_document_chunks, save_document_chunks


def validate_pdf_upload(filename: str, content: bytes) -> None:
    if not filename.lower().endswith(".pdf"):
        raise InvalidDocumentError("Only PDF files are accepted.")
    if not content.startswith(b"%PDF"):
        raise InvalidDocumentError("The uploaded file is not a valid PDF.")


def process_document(filename: str, content: bytes) -> DocumentUploadResponse:
    validate_pdf_upload(filename, content)
    document_repository.initialize_database()
    file_hash = hashlib.sha256(content).hexdigest()
    if document_repository.find_by_hash(file_hash):
        raise DuplicateDocumentError("This document has already been uploaded.")

    settings = get_settings()
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    document_id = str(uuid4())
    stored_path = settings.upload_dir / f"{document_id}.pdf"
    stored_path.write_bytes(content)

    vectors_saved = False
    try:
        chunks = chunk_pages(extract_pages(stored_path))
        if not chunks:
            raise InvalidDocumentError("No text chunks could be created from this PDF.")
        embeddings = create_embeddings([chunk.text for chunk in chunks])
        save_document_chunks(document_id, filename, chunks, embeddings)
        vectors_saved = True
        document_repository.create_document(document_id, filename, stored_path.name, file_hash)
    except Exception:
        if vectors_saved:
            try:
                delete_document_chunks(document_id)
            except Exception:
                pass
        document_repository.delete_uploaded_file(stored_path)
        raise

    return DocumentUploadResponse(
        document_id=document_id,
        filename=filename,
        message="Document uploaded and indexed successfully.",
    )
