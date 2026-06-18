import { useCallback, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { VideoPlayer } from "@/features/tutorial/components/video-player";
import { usePlaylist } from "@/features/tutorial/hooks";
import type { Video } from "@/services/video";

interface VideoPlayerModalProps {
  videos: Video[];
  initialVideoId: string;
  onClose: () => void;
}

export function VideoPlayerModal({ videos, initialVideoId, onClose }: VideoPlayerModalProps) {
  const playlistItems = useMemo(
    () =>
      videos.map((v) => ({
        id: v.id,
        title: v.title,
        sources: [{ src: v.video_url, type: "video/mp4" as const }],
        poster: v.thumbnail_url,
      })),
    [videos],
  );

  const initialIndex = useMemo(
    () => Math.max(0, videos.findIndex((v) => v.id === initialVideoId)),
    [videos, initialVideoId],
  );

  const { state, actions, nextItem } = usePlaylist(playlistItems, initialIndex);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-3xl px-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-5 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg cursor-pointer"
          aria-label="Close video player"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Video title */}
        <p className="mb-2 text-sm text-white/80 truncate">{state.currentItem?.title}</p>

        {/* Player */}
        <VideoPlayer
          sources={state.currentItem?.sources ?? []}
          poster={state.currentItem?.poster}
          autoPlay
          onNext={state.hasNext ? actions.next : undefined}
          onPrevious={state.hasPrevious ? actions.previous : undefined}
          hasNext={state.hasNext}
          hasPrevious={state.hasPrevious}
          preloadSrc={nextItem?.sources[0]?.src}
          videoIndex={state.currentIndex}
        />
      </div>
    </div>
  );
}
