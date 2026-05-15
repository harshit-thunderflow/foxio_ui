export interface StepItem {
  id: string;
  number: number;
  title: string;
  description: string;
}

interface UpcomingStepsProps {
  steps: StepItem[];
}

export function UpcomingSteps({ steps }: UpcomingStepsProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Upcoming Steps
      </h3>

      <div className="relative pl-6 sm:pl-7">
        {/* Vertical line */}
        <div className="absolute left-[10px] sm:left-[11px] top-3 bottom-3 w-0.5 bg-border" />

        <div className="space-y-5 sm:space-y-6">
          {steps.map((step, i) => (
            <div key={step.id} className="relative flex gap-3 sm:gap-4">
              {/* Step circle */}
              <div className="absolute -left-6 sm:-left-7 top-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background border-2 border-border flex items-center justify-center">
                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className={`space-y-0.5 sm:space-y-1 ${i > 0 ? "opacity-40" : "opacity-60"}`}>
                <h4 className="text-xs sm:text-sm text-foreground">
                  {step.title}
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
