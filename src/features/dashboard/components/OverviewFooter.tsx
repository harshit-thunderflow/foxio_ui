import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

export function OverviewFooter() {
  return (
    <div className="shrink-0 border-t border-border/50 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4">
      <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1 text-center">
        Need help?
        <Link to="/chatbot" className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Ask AI
        </Link>
      </p>
    </div>
  );
}
