import { Play, Loader2, AlertCircle, RotateCcw, WifiOff, FileWarning, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VideoErrorType } from "../../hooks";

interface VideoOverlayProps {
  isPlaying: boolean;
  isBuffering: boolean;
  hasError: boolean;
  errorMessage: string;
  errorType: VideoErrorType | null;
  retryCount: number;
  maxRetries?: number;
  onTogglePlay: () => void;
  onRetry: () => void;
}

const errorIcons: Record<VideoErrorType, typeof AlertCircle> = {
  network: WifiOff,
  decode: FileWarning,
  format: Ban,
  notfound: FileWarning,
  unknown: AlertCircle,
};

export function VideoOverlay({
  isPlaying,
  isBuffering,
  hasError,
  errorMessage,
  errorType,
  retryCount,
  maxRetries = 3,
  onTogglePlay,
  onRetry,
}: VideoOverlayProps) {
  if (hasError) {
    const Icon = errorIcons[errorType ?? "unknown"];
    const canRetry = retryCount < maxRetries;

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3 text-white px-4">
        <Icon className="w-9 h-9 text-destructive" />
        <p className="text-xs sm:text-sm text-center max-w-xs leading-relaxed">
          {errorMessage}
        </p>
        {canRetry ? (
          <Button size="sm" variant="secondary" onClick={onRetry} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Retry ({retryCount}/{maxRetries})
          </Button>
        ) : (
          <p className="text-[11px] text-muted-foreground text-center">
            Please check the video source or try again later.
          </p>
        )}
      </div>
    );
  }

  if (isBuffering) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={onTogglePlay}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
        </div>
      </div>
    );
  }

  return null;
}
