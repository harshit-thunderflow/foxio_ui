import { useState } from "react";
import { Globe, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublicPageContext } from "@/hooks";

export function ContextLabel() {
  const { context, loading } = usePublicPageContext();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const label = loading
    ? "...fetching context"
    : context?.title
      ? `Currently Viewing: ${context.title}`
      : null;

  if (!label) return null;

  return (
    <Badge variant="outline" className="gap-2 px-2.5 py-1 rounded-full bg-muted border-border w-fit max-w-full">
      <Globe className="h-3 w-3 text-emerald-500 shrink-0" />
      <span className="text-[11px] font-semibold text-muted-foreground truncate">
        {label}
      </span>
      <Button variant="ghost" size="icon-xs" onClick={() => setDismissed(true)} className="h-4 w-4 rounded-full">
        <X className="w-2.5 h-2.5 text-muted-foreground" />
      </Button>
    </Badge>
  );
}
