import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
  title: string;
  description: string;
  completed: number;
  total: number;
}

export function SectionHeading({ title, description, completed, total }: SectionHeadingProps) {
  return (
    <div className="space-y-1 sm:space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
        <Badge variant="secondary" className="gap-1 bg-accent border-border text-primary">
          <Check className="w-3 h-3" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            {completed} of {total} complete
          </span>
        </Badge>
      </div>
      <p className="text-xs sm:text-[13px] text-muted-foreground leading-snug max-w-lg">
        {description}
      </p>
    </div>
  );
}
