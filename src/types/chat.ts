export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
};

export type UploadedDocument = {
  id: string;
  filename: string;
  size: number;
  uploadedAt: Date;
};
