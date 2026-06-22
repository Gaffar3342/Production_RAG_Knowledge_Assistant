import { KeyboardEvent, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  isSending: boolean;
  onSend: (message: string) => void;
};

export function ChatInput({ isSending, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const message = value.trim();
    if (!message || isSending) return;
    onSend(message);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t bg-background/85 p-4 backdrop-blur-xl sm:p-5">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel flex items-end gap-3 rounded-lg p-3">
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the uploaded PDFs..."
            disabled={isSending}
            className="max-h-44 min-h-[54px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button size="icon" onClick={submit} disabled={!value.trim() || isSending} aria-label="Send message">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
