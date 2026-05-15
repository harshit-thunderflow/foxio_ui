import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ChatStep {
  number: number;
  text: string;
}

export interface ChatMessageData {
  id: string;
  role: "ai" | "user";
  content: string;
  steps?: ChatStep[];
  action?: { label: string; icon?: React.ReactNode };
}

interface ChatMessageProps {
  message: ChatMessageData;
  onAction?: () => void;
}

export function ChatMessage({ message, onAction }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] px-3 py-2.5 sm:px-4 sm:py-3 bg-primary text-primary-foreground rounded-xl rounded-tr-none shadow-sm">
          <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
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
      <div className="max-w-[80%] p-2.5 sm:p-3 rounded-xl rounded-tl-none border border-border bg-muted/40 shadow-sm space-y-2">
        <p className="text-sm sm:text-base text-foreground leading-relaxed">{message.content}</p>

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
    </div>
  );
}
