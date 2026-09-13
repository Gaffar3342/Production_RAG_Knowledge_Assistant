from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)


class SourceCitation(BaseModel):
    document_id: str
    filename: str
    page_number: int
    chunk_id: str
    excerpt: str
    relevance: float


class ChatResponse(BaseModel):
    answer: str
    confidence: float
    sources: list[SourceCitation]


class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    message: str


class DocumentSummary(BaseModel):
    id: str
    original_filename: str
    created_at: str
