import { Card } from "@/components/ui/card";

interface HelpIllustrationProps {
  imageUrl: string;
}

export function HelpIllustration({ imageUrl }: HelpIllustrationProps) {
  return (
    <Card className="relative p-0 overflow-hidden rounded-2xl shadow-inner border-none bg-transparent">
      <img
        src={imageUrl}
        alt="Step visualization"
        className="w-full h-36 sm:h-44 md:h-48 object-cover opacity-80 saturate-0"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
    </Card>
  );
}
