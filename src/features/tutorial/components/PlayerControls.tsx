import { SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface PlayerControlsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  autoplay?: boolean;
  onAutoplayChange?: (value: boolean) => void;
}

export function PlayerControls({ onPrevious, onNext, autoplay = false, onAutoplayChange }: PlayerControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 max-w-2xl w-full">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onPrevious} className="gap-1 text-primary hover:text-primary">
          <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">Previous</span>
        </Button>
        <Button size="sm" onClick={onNext} className="gap-1">
          <span className="text-xs sm:text-sm">Next</span>
          <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
      {/* Autoplay Toggle */}
      <div className="flex items-center gap-2">
        <Switch checked={autoplay} onCheckedChange={onAutoplayChange} />
        <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">Autoplay</span>
      </div>
    </div>
  );
}
