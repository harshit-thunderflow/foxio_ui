import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoPlayerCardProps {
  thumbnailUrl: string;
  progress?: number;
  onPlay?: () => void;
}

export function VideoPlayerCard({ thumbnailUrl, progress = 0, onPlay }: VideoPlayerCardProps) {
  return (
    <Card className="relative w-full max-w-2xl aspect-video p-0 overflow-hidden bg-foreground border-border shadow-lg">
      <img
        src={thumbnailUrl}
        alt="Tutorial Video"
        className="w-full h-full object-cover opacity-80"
      />
      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          size="icon-lg"
          onClick={onPlay}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary/90 hover:bg-primary shadow-[0_10px_15px_-3px] shadow-primary/50 hover:scale-105 transition-transform"
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
        </Button>
      </div>
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/20">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
    </Card>
  );
}
