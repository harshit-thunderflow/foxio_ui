import { Crosshair } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActiveStepCardProps {
  stepLabel: string;
  title: string;
  instruction: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function ActiveStepCard({
  stepLabel,
  title,
  instruction,
  onAction,
  actionLabel = "Show me",
}: ActiveStepCardProps) {
  return (
    <Card className="gap-3 sm:gap-4 p-3 sm:p-4 border-muted-foreground/30 shadow-lg rounded-2xl">
      <CardContent className="p-0 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-primary">
              {stepLabel}
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
              {title}
            </h2>
          </div>
          <div className="shrink-0 p-1.5 sm:p-2 bg-accent rounded-xl">
            <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
        </div>

        {/* Instruction Block */}
        <div className="border-l-4 border-primary bg-muted/50 rounded-xl p-3 sm:p-4">
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            {instruction}
          </p>
        </div>

        {/* Action Button */}
        <Button onClick={onAction} className="w-full h-10 sm:h-11 rounded-xl shadow-md gap-2">
          <span className="text-xs sm:text-sm text-primary-foreground">{actionLabel}</span>
          <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </Button>
      </CardContent>
    </Card>
  );
}
