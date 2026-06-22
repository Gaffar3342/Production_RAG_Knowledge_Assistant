export type UploadResponse = {
  message: string;
  filename: string;
};

export type ChatRequest = {
  question: string;
};

export type ChatResponse = {
  answer: string;
};

export type ApiErrorResponse = {
  detail?: string;
  message?: string;
};
