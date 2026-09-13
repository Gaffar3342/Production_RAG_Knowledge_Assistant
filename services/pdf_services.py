from dataclasses import dataclass
from pathlib import Path

from openai import OpenAI
from pypdf import PdfReader

from config import get_settings
from services.exceptions import InvalidDocumentError


@dataclass(frozen=True)
class TextChunk:
    text: str
    page_number: int
    chunk_index: int


def _get_openai_client() -> OpenAI:
    settings = get_settings()
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured.")
    return OpenAI(api_key=settings.openai_api_key)


def extract_pages(pdf_path: Path) -> list[tuple[int, str]]:
    try:
        reader = PdfReader(str(pdf_path))
    except Exception as error:
        raise InvalidDocumentError("The uploaded file could not be read as a PDF.") from error

    if reader.is_encrypted:
        raise InvalidDocumentError("Encrypted PDFs are not supported.")

    pages: list[tuple[int, str]] = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if text:
            pages.append((page_number, text))

    if not pages:
        raise InvalidDocumentError(
            "No selectable text was found. Scanned PDFs need OCR before upload."
        )
    return pages


def chunk_pages(
    pages: list[tuple[int, str]], chunk_size: int = 1000, overlap: int = 150
) -> list[TextChunk]:
    chunks: list[TextChunk] = []
    step = chunk_size - overlap

    for page_number, text in pages:
        for start in range(0, len(text), step):
            chunk_text = text[start : start + chunk_size].strip()
            if chunk_text:
                chunks.append(
                    TextChunk(
                        text=chunk_text,
                        page_number=page_number,
                        chunk_index=len(chunks),
                    )
                )
    return chunks


def create_embeddings(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    client = _get_openai_client()
    model = get_settings().embedding_model
    vectors: list[list[float]] = []
    batch_size = 100

    for start in range(0, len(texts), batch_size):
        response = client.embeddings.create(model=model, input=texts[start : start + batch_size])
        vectors.extend(item.embedding for item in response.data)
    return vectors


def create_query_embedding(question: str) -> list[float]:
    return create_embeddings([question])[0]
