import { ContextLabel } from "@/components/common/ContextLabel";

interface HeroSectionProps {
  contextText: string;
  title: string;
  description: string;
  onDismissContext?: () => void;
}

export function HeroSection({ contextText, title, description, onDismissContext }: HeroSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <ContextLabel text={contextText} onDismiss={onDismissContext} />
      <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
        {title}
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
        {description}
      </p>
    </div>
  );
}
