import { ChangeEvent, DragEvent, useId, useState } from "react";
import { CheckCircle2, FileUp, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatBytes } from "@/lib/utils";

type UploadDropzoneProps = {
  selectedFile: File | null;
  progress: number;
  isUploading: boolean;
  onChooseFile: (file: File | null) => void;
  onUpload: () => void;
};

export function UploadDropzone({ selectedFile, progress, isUploading, onChooseFile, onUpload }: UploadDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    onChooseFile(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onChooseFile(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Knowledge base</CardTitle>
        <CardDescription>Drop in PDFs to expand the assistant context.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input id={inputId} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={handleFileInput} />
        <label
          htmlFor={inputId}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "group flex min-h-[168px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-background/75 p-5 text-center transition-all",
            isDragging
              ? "border-primary bg-primary/10 ring-4 ring-primary/10"
              : "border-border hover:border-primary/60 hover:bg-accent/40",
          )}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:-translate-y-0.5">
            <UploadCloud className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium">Drag and drop a PDF here</p>
          <p className="mt-1 text-xs text-muted-foreground">or click to browse your files</p>
        </label>

        {selectedFile && (
          <div className="animate-fade-up rounded-lg border bg-background/75 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <FileUp className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onChooseFile(null)} disabled={isUploading} aria-label="Clear file">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="animate-fade-up space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Uploading and indexing</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <Button className="w-full" onClick={onUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Upload PDF
        </Button>
      </CardContent>
    </Card>
  );
}
