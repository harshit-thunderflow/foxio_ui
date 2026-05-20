import { SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface PlayerControlsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  autoplay?: boolean;
  onAutoplayChange?: (value: boolean) => void;
}

export function PlayerControls({ onPrevious, onNext, hasPrevious = true, hasNext = true, autoplay = false, onAutoplayChange }: PlayerControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 max-w-2xl w-full">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="gap-1"
        >
          <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">Previous</span>
        </Button>
        <Button
          size="sm"
          onClick={onNext}
          disabled={!hasNext}
          className="gap-1"
        >
          <span className="text-xs sm:text-sm">Next</span>
          <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
      {/* Autoplay Toggle */}
      <div className="flex items-center gap-2">
        <Switch checked={autoplay} onCheckedChange={onAutoplayChange} />
        <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">Autoplay next</span>
      </div>
    </div>
  );
}
