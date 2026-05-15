import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContextLabelProps {
  text: string;
  onDismiss?: () => void;
}

export function ContextLabel({ text, onDismiss }: ContextLabelProps) {
  return (
    <Badge variant="outline" className="gap-2 sm:gap-3 px-2.5 sm:px-3 py-1 rounded-full bg-muted border-border w-fit max-w-full">
      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(78,222,163,0.5)] shrink-0" />
      <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground truncate">
        {text}
      </span>
      {onDismiss && (
        <Button variant="ghost" size="icon-xs" onClick={onDismiss} className="h-4 w-4 rounded-full">
          <X className="w-2.5 h-2.5 text-muted-foreground" />
        </Button>
      )}
    </Badge>
  );
}
