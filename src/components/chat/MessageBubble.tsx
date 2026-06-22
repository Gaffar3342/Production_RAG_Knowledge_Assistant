import { Bot, User } from "lucide-react";
import { MarkdownMessage } from "@/components/chat/MarkdownMessage";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex animate-fade-up gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[86%] rounded-lg px-4 py-3 text-sm shadow-sm sm:max-w-[76%]",
          isUser ? "bg-primary text-primary-foreground" : "border bg-card text-card-foreground",
        )}
      >
        <MarkdownMessage content={message.content} isUser={isUser} />
      </div>
      {isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <User className="h-4 w-4" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
