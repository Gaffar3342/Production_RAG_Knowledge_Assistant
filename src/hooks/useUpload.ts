import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchDocuments, uploadDocument } from "@/services/api";
import type { UploadedDocument } from "@/types/chat";

const mapDocument = (document: { id: string; original_filename: string; created_at: string }): UploadedDocument => ({
  id: document.id,
  filename: document.original_filename,
  uploadedAt: new Date(document.created_at),
});

export function useUpload() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let isActive = true;
    fetchDocuments()
      .then((response) => {
        if (isActive) setDocuments(response.map(mapDocument));
      })
      .catch(() => {
        // The backend status badge is the visible error state for an unavailable API.
      });
    return () => {
      isActive = false;
    };
  }, []);

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
    setProgress(20);

    try {
      const response = await uploadDocument(selectedFile);
      const document: UploadedDocument = {
        id: response.document_id,
        filename: response.filename || selectedFile.name,
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
