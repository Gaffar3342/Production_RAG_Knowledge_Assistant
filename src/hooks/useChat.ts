import { useMemo, useState } from "react";
import { toast } from "sonner";
import { sendChatMessage } from "@/services/api";
import type { ChatMessage } from "@/types/chat";

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const sendMessage = async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isSending) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmedQuestion,
      createdAt: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setIsSending(true);

    try {
      const response = await sendChatMessage(trimmedQuestion);
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: response.answer,
        createdAt: new Date(),
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send message.";
      toast.error("Chat request failed", { description: message });
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: "I could not reach the knowledge assistant. Please check the backend and try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return { messages, hasMessages, isSending, sendMessage };
}
