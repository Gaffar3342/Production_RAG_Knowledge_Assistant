import { MessageSquareText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-lg border bg-card shadow-soft">
        <MessageSquareText className="h-10 w-10 text-primary" aria-hidden="true" />
      </div>
      <h2 className="text-balance text-2xl font-semibold tracking-normal sm:text-3xl">
        Ask questions about your uploaded documents
      </h2>
      <p className="mt-3 max-w-xl text-balance text-sm leading-6 text-muted-foreground sm:text-base">
        The assistant answers only using uploaded PDF knowledge.
      </p>
    </div>
  );
}
