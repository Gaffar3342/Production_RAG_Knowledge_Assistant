import { Bot, Circle, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BackendStatus } from "@/hooks/useBackendStatus";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  backendStatus: BackendStatus;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

const statusLabel: Record<BackendStatus, string> = {
  checking: "Checking",
  online: "Connected",
  offline: "Offline",
};

export function AppHeader({ backendStatus, theme, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-normal sm:text-lg">
              Production RAG Knowledge Assistant
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Grounded answers from uploaded PDFs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs font-medium text-muted-foreground sm:flex">
            <Circle
              className={cn(
                "h-2.5 w-2.5 fill-current",
                backendStatus === "online" && "text-emerald-500",
                backendStatus === "offline" && "text-destructive",
                backendStatus === "checking" && "animate-pulse text-amber-500",
              )}
              aria-hidden="true"
            />
            {statusLabel[backendStatus]}
          </div>
          <Button variant="outline" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
