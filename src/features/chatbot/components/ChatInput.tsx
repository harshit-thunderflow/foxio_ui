import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSend, placeholder = "Ask how to use this feature..." }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="space-y-2 sm:space-y-2.5">
      <div className="ai-input-wrapper">
        <div className="relative flex items-center">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={placeholder}
            className="pr-12 sm:pr-14 h-11 sm:h-12 rounded-[10px] text-sm px-4 border-0! shadow-none! ring-0! focus-visible:ring-0! focus-visible:outline-none! bg-transparent text-foreground placeholder:text-muted-foreground"
          />
          <Button
            size="icon-sm"
            onClick={handleSend}
            className="absolute right-2.5 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary hover:bg-primary/90 cursor-pointer"
          >
            <SendHorizonal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
          </Button>
        </div>
      </div>
      <p className="text-[10px] sm:text-[11px] text-muted-foreground text-center px-2">
        AI responses are generated and may not always be accurate.
      </p>
    </div>
  );
}
