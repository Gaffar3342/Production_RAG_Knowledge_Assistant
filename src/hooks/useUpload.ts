import { useState } from "react";
import { toast } from "sonner";
import { uploadDocument } from "@/services/api";
import type { UploadedDocument } from "@/types/chat";

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function useUpload() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const chooseFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Unsupported file", { description: "Please select a PDF document." });
      return;
    }

    setSelectedFile(file);
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setProgress(12);
    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + 13, 88));
    }, 260);

    try {
      const response = await uploadDocument(selectedFile);
      const document: UploadedDocument = {
        id: createId(),
        filename: response.filename || selectedFile.name,
        size: selectedFile.size,
        uploadedAt: new Date(),
      };

      setDocuments((current) => [document, ...current]);
      setProgress(100);
      toast.success(response.message || "Document uploaded successfully", {
        description: document.filename,
      });
      setSelectedFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload document.";
      toast.error("Upload failed", { description: message });
      setProgress(0);
    } finally {
      window.clearInterval(interval);
      window.setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 520);
    }
  };

  return {
    documents,
    selectedFile,
    progress,
    isUploading,
    chooseFile,
    uploadSelectedFile,
  };
}
