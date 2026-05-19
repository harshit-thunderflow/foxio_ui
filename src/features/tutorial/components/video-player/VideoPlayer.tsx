import { Card } from "@/components/ui/card";
import { useVideoPlayer } from "../../hooks";
import { VideoOverlay } from "./VideoOverlay";
import { VideoControlsBar } from "./VideoControlsBar";
import { AlertCircle } from "lucide-react";

export interface VideoSource {
  src: string;
  type: "video/mp4" | "video/webm";
}

interface VideoPlayerProps {
  sources: VideoSource[];
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({ sources, poster, autoPlay = false, className }: VideoPlayerProps) {
  const { videoRef, containerRef, state, actions } = useVideoPlayer();

  if (!sources || sources.length === 0) {
    return (
      <Card className={`relative w-full max-w-2xl aspect-video p-0 overflow-hidden bg-black border-border shadow-lg flex items-center justify-center ${className ?? ""}`}>
        <div className="flex flex-col items-center gap-2 text-white">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-xs sm:text-sm text-center px-4">No video source provided.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      ref={containerRef}
      className={`group/player relative w-full max-w-2xl aspect-video p-0 overflow-hidden bg-black border-border shadow-lg select-none ${className ?? ""}`}
    >
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        className="w-full h-full object-contain"
        onClick={actions.togglePlay}
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
        Your browser does not support the video tag.
      </video>

      <VideoOverlay
        isPlaying={state.isPlaying}
        isBuffering={state.isBuffering}
        hasError={state.hasError}
        errorMessage={state.errorMessage}
        errorType={state.errorType}
        retryCount={state.retryCount}
        onTogglePlay={actions.togglePlay}
        onRetry={actions.retry}
      />

      {!state.hasError && (
        <VideoControlsBar state={state} actions={actions} />
      )}
    </Card>
  );
}
