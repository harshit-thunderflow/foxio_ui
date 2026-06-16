import { Check } from "lucide-react";

export interface ProgressStep {
  step: number;
  label: string;
  status: "done" | "active" | "pending";
}

interface ProgressRailProps {
  steps: ProgressStep[];
}

export function ProgressRail({ steps }: ProgressRailProps) {
  return (
    <div className="flex items-start w-full">
      {steps.map((item, i) => (
        <div key={item.step} className="contents">
          {/* Step circle + label */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`size-6 sm:size-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 transition-all ${
                item.status === "done"
                  ? "bg-primary text-primary-foreground"
                  : item.status === "active"
                  ? "bg-primary text-primary-foreground ring-[3px] sm:ring-4 ring-primary/25"
                  : "bg-muted text-muted-foreground border-2 border-muted-foreground/30"
              }`}
            >
              {item.status === "done" ? (
                <Check className="size-3 sm:size-3.5" />
              ) : (
                item.step
              )}
            </div>
            <span
              className={`mt-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wide text-center leading-tight whitespace-nowrap ${
                item.status === "done" || item.status === "active"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </div>

          {/* Connecting line — takes all remaining space between circles */}
          {i < steps.length - 1 && (
            <div className="flex-1 min-w-2 self-start h-6 sm:h-7 flex items-center">
              <div
                className={`w-full h-0.5 rounded-full transition-colors ${
                  item.status === "done" ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
