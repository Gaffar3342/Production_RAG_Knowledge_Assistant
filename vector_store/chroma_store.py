from dataclasses import dataclass

from config import get_settings
from services.pdf_services import TextChunk


COLLECTION_NAME = "document_chunks"


@dataclass(frozen=True)
class RetrievedChunk:
    document_id: str
    filename: str
    page_number: int
    chunk_id: str
    text: str
    relevance: float


def _get_collection():
    # Importing Chroma is intentionally lazy: health checks do not require the vector DB.
    import chromadb

    settings = get_settings()
    settings.chroma_path.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(settings.chroma_path))
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def save_document_chunks(
    document_id: str, filename: str, chunks: list[TextChunk], embeddings: list[list[float]]
) -> None:
    collection = _get_collection()
    ids = [f"{document_id}:{chunk.chunk_index}" for chunk in chunks]
    collection.upsert(
        ids=ids,
        documents=[chunk.text for chunk in chunks],
        embeddings=embeddings,
        metadatas=[
            {
                "document_id": document_id,
                "filename": filename,
                "page_number": chunk.page_number,
                "chunk_index": chunk.chunk_index,
            }
            for chunk in chunks
        ],
    )


def delete_document_chunks(document_id: str) -> None:
    _get_collection().delete(where={"document_id": document_id})


def search_similar(query_embedding: list[float], limit: int = 4) -> list[RetrievedChunk]:
    result = _get_collection().query(
        query_embeddings=[query_embedding],
        n_results=limit,
        include=["documents", "metadatas", "distances"],
    )
    documents = result.get("documents", [[]])[0] or []
    metadatas = result.get("metadatas", [[]])[0] or []
    distances = result.get("distances", [[]])[0] or []

    return [
        RetrievedChunk(
            document_id=metadata["document_id"],
            filename=metadata["filename"],
            page_number=int(metadata["page_number"]),
            chunk_id=f"{metadata['document_id']}:{metadata['chunk_index']}",
            text=document,
            relevance=round(1 / (1 + float(distance)), 3),
        )
        for document, metadata, distance in zip(documents, metadatas, distances)
    ]
