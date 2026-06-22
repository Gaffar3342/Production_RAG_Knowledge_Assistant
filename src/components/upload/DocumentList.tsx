import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes } from "@/lib/utils";
import type { UploadedDocument } from "@/types/chat";

type DocumentListProps = {
  documents: UploadedDocument[];
};

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded documents</CardTitle>
        <CardDescription>{documents.length ? `${documents.length} document${documents.length === 1 ? "" : "s"} ready` : "No PDFs uploaded yet"}</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-11/12" />
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex animate-fade-up items-center gap-3 rounded-lg border bg-background/75 p-3 transition-colors hover:bg-accent/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{document.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(document.size)} · {document.uploadedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
