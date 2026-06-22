import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-[linear-gradient(110deg,hsl(var(--muted)),45%,hsl(var(--muted-foreground)/0.16),55%,hsl(var(--muted)))] bg-[length:700px_100%]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
