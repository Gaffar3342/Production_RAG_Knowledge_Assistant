import { useEffect, useRef } from "react";
import { EmptyState } from "@/components/chat/EmptyState";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import type { ChatMessage } from "@/types/chat";

type ChatPanelProps = {
  messages: ChatMessage[];
  hasMessages: boolean;
  isSending: boolean;
  onSend: (message: string) => void;
};

export function ChatPanel({ messages, hasMessages, isSending, onSend }: ChatPanelProps) {
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        {hasMessages ? (
          <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 sm:px-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isSending && <TypingIndicator />}
            <div ref={scrollAnchorRef} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      <ChatInput isSending={isSending} onSend={onSend} />
    </main>
  );
}
