import { useState, useCallback, useRef } from "react";
import { Sparkles, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";
import { sendFeedback } from "@/services/chat";

export interface ChatStep {
  number: number;
  text: string;
}

export interface ChatMessageData {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp?: string;
  steps?: ChatStep[];
  action?: { label: string; icon?: React.ReactNode };
}

interface ChatMessageProps {
  message: ChatMessageData;
  onAction?: () => void;
}

const FEEDBACK_DEBOUNCE = 800;

export function ChatMessage({ message, onAction }: ChatMessageProps) {
  const [feedback, setFeedback] = useState<"thumbs_up" | "thumbs_down" | null>(null);
  const [copied, setCopied] = useState(false);
  const lastSentRef = useRef<"thumbs_up" | "thumbs_down" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFeedback = useCallback(
    (rating: "thumbs_up" | "thumbs_down") => {
      // Toggle: click same thumb again → undo
      const next = feedback === rating ? null : rating;
      setFeedback(next);

      // Cancel any pending API call
      if (timerRef.current) clearTimeout(timerRef.current);

      // If final state is same as what's already saved on server, skip
      if (next === lastSentRef.current) return;

      // Only call API if there's something to send (not null/undo)
      if (next === null) {
        // No "delete feedback" API, so we just don't send anything
        lastSentRef.current = null;
        return;
      }

      // Debounce the API call
      timerRef.current = setTimeout(async () => {
        try {
          await sendFeedback(message.id, { rating: next });
          lastSentRef.current = next;
        } catch {
          // silently fail
        }
      }, FEEDBACK_DEBOUNCE);
    },
    [feedback, message.id]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  }, [message.content]);

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] px-3 py-2.5 sm:px-4 sm:py-3 bg-primary text-primary-foreground rounded-xl rounded-tr-none shadow-sm">
          <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
          {message.timestamp && (
            <p className="text-[10px] opacity-70 text-right mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      {/* AI Avatar */}
      <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" />
      </div>

      {/* Message Bubble */}
      <div className="max-w-[80%] space-y-1.5">
        <div className="p-2.5 sm:p-3 rounded-xl rounded-tl-none border border-border bg-muted/40 shadow-sm space-y-2">
          <div className="prose-chat text-sm sm:text-base text-foreground leading-relaxed">
            <Markdown>{message.content}</Markdown>
          </div>
          {message.timestamp && (
            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}

          {/* Numbered Steps */}
          {message.steps && message.steps.length > 0 && (
            <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
              {message.steps.map((step) => (
                <div key={step.number} className="flex items-start gap-2 sm:gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {step.number}
                  </span>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-0.5">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          {message.action && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              className="mt-1 sm:mt-2 gap-1.5 rounded-lg"
            >
              {message.action.icon}
              <span className="text-xs sm:text-sm">{message.action.label}</span>
            </Button>
          )}
        </div>

        {/* Feedback & Copy actions */}
        <div className="flex items-center gap-1 pl-1">
          <button
            type="button"
            onClick={() => handleFeedback("thumbs_up")}
            className="p-1 rounded-md hover:bg-accent transition-colors cursor-pointer"
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 ${
                feedback === "thumbs_up" ? "text-chart-1" : "text-muted-foreground"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => handleFeedback("thumbs_down")}
            className="p-1 rounded-md hover:bg-accent transition-colors cursor-pointer"
          >
            <ThumbsDown
              className={`w-3.5 h-3.5 ${
                feedback === "thumbs_down" ? "text-chart-1" : "text-muted-foreground"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-accent transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-chart-1" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
