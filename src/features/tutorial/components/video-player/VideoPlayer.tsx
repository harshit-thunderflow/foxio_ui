import { useEffect, useRef } from "react";
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
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  preloadSrc?: string;
}

export function VideoPlayer({
  sources,
  poster,
  autoPlay = false,
  className,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  preloadSrc,
}: VideoPlayerProps) {
  const { videoRef, containerRef, state, actions } = useVideoPlayer({ onEnded: autoPlay && hasNext ? onNext : undefined });
  const prevSrcRef = useRef(sources[0]?.src);
  const hasPlayedRef = useRef(false);

  // Track first user-initiated play
  useEffect(() => {
    if (state.isPlaying && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
    }
  }, [state.isPlaying]);

  // When sources change, load new source without remounting (preserves fullscreen)
  const currentSrc = sources[0]?.src;
  useEffect(() => {
    if (currentSrc && currentSrc !== prevSrcRef.current) {
      prevSrcRef.current = currentSrc;
      const video = videoRef.current;
      if (video) {
        video.src = currentSrc;
        video.poster = poster ?? "";
        video.load();
        if (autoPlay && hasPlayedRef.current) video.play().catch(() => {});
      }
    }
  }, [currentSrc, poster, autoPlay, videoRef]);

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
        src={sources[0]?.src}
        poster={poster}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className="w-full h-full object-contain"
        onClick={actions.togglePlay}
      />

      {/* Preload next video */}
      {preloadSrc && (
        <link rel="preload" as="video" href={preloadSrc} />
      )}

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
        <VideoControlsBar
          state={state}
          actions={actions}
          onNext={onNext}
          onPrevious={onPrevious}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        />
      )}
    </Card>
  );
}
