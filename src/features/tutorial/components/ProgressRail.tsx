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
    <div className="flex items-center justify-between px-0.5 sm:px-1">
      {steps.map((item, i) => (
        <div key={item.step} className="flex items-center flex-1 last:flex-initial">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div
              className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${
                item.status === "done"
                  ? "bg-primary text-primary-foreground"
                  : item.status === "active"
                  ? "bg-primary text-primary-foreground ring-[3px] sm:ring-4 ring-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {item.status === "done" ? (
                <Check className="w-2.5 h-2 sm:w-3 sm:h-2.5 text-primary-foreground" />
              ) : (
                item.step
              )}
            </div>
            <span
              className={`text-[10px] sm:text-[11px] font-bold tracking-wider ${
                item.status !== "pending" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1.5 sm:mx-2 ${
                item.status === "done" ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
