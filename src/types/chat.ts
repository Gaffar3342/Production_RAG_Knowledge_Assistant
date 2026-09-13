export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
  sources?: SourceCitation[];
  confidence?: number;
};

export type UploadedDocument = {
  id: string;
  filename: string;
  uploadedAt: Date;
};
import type { SourceCitation } from "@/types/api";
