export type UploadResponse = {
  document_id: string;
  message: string;
  filename: string;
};

export type ChatRequest = {
  question: string;
};

export type ChatResponse = {
  answer: string;
  confidence: number;
  sources: SourceCitation[];
};

export type SourceCitation = {
  document_id: string;
  filename: string;
  page_number: number;
  chunk_id: string;
  excerpt: string;
  relevance: number;
};

export type DocumentSummary = {
  id: string;
  original_filename: string;
  created_at: string;
};

export type ApiErrorResponse = {
  detail?: string;
  message?: string;
};
