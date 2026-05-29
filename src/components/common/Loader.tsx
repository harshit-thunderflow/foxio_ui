import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-8 w-8" };

export function Spinner({ size = "md", className }: SpinnerProps) {
  return <Loader2 className={cn("animate-spin", sizeMap[size], className)} />;
}

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loader({ size = "md", text, className, fullScreen = false }: LoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-2",
      fullScreen && "h-full w-full",
      className
    )}>
      <Spinner size={size} />
      {text && <p className="text-xs text-muted-foreground">{text}</p>}
    </div>
  );
}
