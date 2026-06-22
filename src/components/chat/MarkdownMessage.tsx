import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MarkdownMessageProps = {
  content: string;
  isUser: boolean;
};

export function MarkdownMessage({ content, isUser }: MarkdownMessageProps) {
  if (isUser) return <p className="whitespace-pre-wrap leading-7">{content}</p>;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={cn(
        "prose prose-sm max-w-none leading-7 dark:prose-invert",
        "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-pre:rounded-md prose-pre:bg-muted prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
      )}
    >
      {content}
    </ReactMarkdown>
  );
}
