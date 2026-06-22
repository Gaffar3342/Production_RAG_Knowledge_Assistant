import { BookOpenCheck, Database, FileText, ShieldCheck } from "lucide-react";
import { DocumentList } from "@/components/upload/DocumentList";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import type { UploadedDocument } from "@/types/chat";

type SidebarProps = {
  documents: UploadedDocument[];
  selectedFile: File | null;
  progress: number;
  isUploading: boolean;
  onChooseFile: (file: File | null) => void;
  onUpload: () => void;
};

export function Sidebar({ documents, selectedFile, progress, isUploading, onChooseFile, onUpload }: SidebarProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r bg-card/60 lg:w-[390px]">
      <div className="space-y-4 border-b p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-tight tracking-normal">Production RAG Knowledge Assistant</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Upload PDF documents and ask questions using Retrieval-Augmented Generation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="rounded-md border bg-background/70 p-3">
            <FileText className="mb-2 h-4 w-4 text-primary" />
            PDF ingest
          </div>
          <div className="rounded-md border bg-background/70 p-3">
            <Database className="mb-2 h-4 w-4 text-primary" />
            Vector search
          </div>
          <div className="rounded-md border bg-background/70 p-3">
            <ShieldCheck className="mb-2 h-4 w-4 text-primary" />
            Grounded AI
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 scrollbar-thin">
        <UploadDropzone
          selectedFile={selectedFile}
          progress={progress}
          isUploading={isUploading}
          onChooseFile={onChooseFile}
          onUpload={onUpload}
        />
        <DocumentList documents={documents} />
      </div>
    </aside>
  );
}
