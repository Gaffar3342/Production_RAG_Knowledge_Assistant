export function TypingIndicator() {
  return (
    <div className="flex animate-fade-up justify-start gap-3">
      <div className="mt-1 h-8 w-8 rounded-md bg-accent" />
      <div className="flex items-center gap-1 rounded-lg border bg-card px-4 py-4 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}
