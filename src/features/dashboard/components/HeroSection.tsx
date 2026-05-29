import { ContextLabel } from "@/components/common/ContextLabel";

interface HeroSectionProps {
  title: string;
  description: string;
}

export function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <ContextLabel />
      <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
        {title}
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
        {description}
      </p>
    </div>
  );
}
