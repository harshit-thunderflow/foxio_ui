import { useState, useMemo, useCallback, useRef } from "react";
import { ContextLabel } from "@/components/common/ContextLabel";
import { usePageTitle, useVideos, useVideoProgress } from "@/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import {
  SectionHeading,
  ProgressRail,
  VideoPlayer,
  PlayerControls,
  Checklist,
  VideoFooter,
  TutorialSkeleton,
} from "./components";
import { usePlaylist, useProgressTracking } from "./hooks";
import type { PlaylistItem } from "./hooks";
import type { ProgressStep } from "./components/ProgressRail";
import type { ChecklistItem } from "./components/Checklist";

export function TutorialPage() {
  usePageTitle("Tutorial");
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem("foxio-autoplay") === "true");

  // Local fetching — not shared with library, so progress changes reflect immediately
  const { videos, loading: videosLoading, error } = useVideos();
  const { progress, loading: progressLoading, refetch: refetchProgress } = useVideoProgress();

  const loading = videosLoading || progressLoading;

  // Show skeleton until BOTH videos and progress have loaded at least once
  const isInitialLoad = videos.length === 0 || progress === null;

  const sortedVideos = useMemo(
    () => [...videos].sort((a, b) => a.order - b.order),
    [videos]
  );

  const playlist: PlaylistItem[] = useMemo(
    () =>
      sortedVideos.map((v) => ({
        id: v.id,
        title: v.title,
        sources: [{ src: v.video_url, type: (v.mime_type || "video/mp4") as "video/mp4" | "video/webm" }],
        poster: v.thumbnail_url || undefined,
      })),
    [sortedVideos]
  );

  // Determine initial index from progress — first non-completed video
  const initialIndex = useMemo(() => {
    if (!progress?.items.length) return 0;
    const completedIds = new Set(
      progress.items
        .filter((p) => p.status === "completed" || p.progress_percent >= 100)
        .map((p) => p.video_id)
    );
    const idx = sortedVideos.findIndex((v) => !completedIds.has(v.id));
    // All completed → return last index
    return idx === -1 ? Math.max(sortedVideos.length - 1, 0) : idx;
  }, [progress, sortedVideos]);

  // Detect if all videos were already completed from backend
  const allCompletedFromBackend = useMemo(() => {
    if (!progress?.items.length || !sortedVideos.length) return false;
    const completedIds = new Set(
      progress.items
        .filter((p) => p.status === "completed" || p.progress_percent >= 100)
        .map((p) => p.video_id)
    );
    return sortedVideos.every((v) => completedIds.has(v.id));
  }, [progress, sortedVideos]);

  const { state: playlistState, actions: playlistActions, nextItem } = usePlaylist(playlist, initialIndex);
  const { currentItem, hasNext, hasPrevious, currentIndex, total } = playlistState;

  const [allDone, setAllDone] = useState(false);
  const [rewatching, setRewatching] = useState(false);
  const isAllCompleted = (allDone || allCompletedFromBackend) && !rewatching;

  // Build completed set from backend progress
  const completedVideoIds = useMemo(() => {
    if (!progress?.items.length) return new Set<string>();
    return new Set(
      progress.items
        .filter((p) => p.status === "completed" || p.progress_percent >= 100)
        .map((p) => p.video_id)
    );
  }, [progress]);

  // effectiveCompleted: use the higher of currentIndex or backend-known completed count
  const backendCompleted = useMemo(
    () => sortedVideos.filter((v) => completedVideoIds.has(v.id)).length,
    [sortedVideos, completedVideoIds]
  );
  const effectiveCompleted = isAllCompleted ? total : Math.max(currentIndex, backendCompleted);

  const steps: ProgressStep[] = useMemo(
    () =>
      sortedVideos.map((v, i) => ({
        step: v.order || i + 1,
        label: v.step_label || `Step ${i + 1}`,
        status: i < effectiveCompleted ? "done" : i === effectiveCompleted ? "active" : "pending",
      })),
    [sortedVideos, effectiveCompleted]
  );

  const checklistItems: ChecklistItem[] = useMemo(
    () =>
      sortedVideos.map((v, i) => ({
        id: v.id,
        text: v.checklist_text || v.title,
        status: i < effectiveCompleted ? "done" : i === effectiveCompleted ? "active" : "pending",
      })),
    [sortedVideos, effectiveCompleted]
  );

  const completedCount = effectiveCompleted;

  const handleAutoplayChange = (value: boolean) => {
    setAutoplay(value);
    localStorage.setItem("foxio-autoplay", String(value));
  };

  // Player state ref for progress tracking
  const playerStateRef = useRef({ currentTime: 0, duration: 0, isPlaying: false });
  const getPlayerState = useCallback(() => playerStateRef.current, []);

  const currentVideoId = currentItem?.id;

  // Disable progress tracking if all videos already completed
  const shouldTrackProgress = !allCompletedFromBackend && !rewatching;

  const { markComplete } = useProgressTracking({
    videoId: shouldTrackProgress ? currentVideoId : undefined,
    getPlayerState,
    onCompleted: refetchProgress,
  });

  const handleTimeUpdate = useCallback((time: number, duration: number, isPlaying: boolean) => {
    playerStateRef.current = { currentTime: time, duration, isPlaying };
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (shouldTrackProgress) {
      markComplete(currentVideoId);
    }
    if (hasNext) {
      playlistActions.next();
    } else {
      setAllDone(true);
      setRewatching(false);
    }
  }, [shouldTrackProgress, markComplete, currentVideoId, hasNext, playlistActions]);

  const handleWatchAgain = useCallback(() => {
    setRewatching(true);
    setAllDone(false);
    playlistActions.goTo(0);
  }, [playlistActions]);

  // Show skeleton until both APIs have responded
  if (isInitialLoad && loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1">
          <TutorialSkeleton />
        </ScrollArea>
        <VideoFooter />
      </div>
    );
  }

  if (error && videos.length === 0) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  if (!playlist.length) return <div className="flex items-center justify-center h-full text-muted-foreground">No tutorials available.</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 px-4">
        <div className="mx-auto max-w-4xl space-y-4">
          <ContextLabel />

          <SectionHeading
            title="Watch Tutorial"
            description="Learn how to streamline your workflow with our Foxio assistant."
            completed={completedCount}
            total={total}
          />

          <ProgressRail steps={steps} />

          {isAllCompleted ? (
            <Card className="flex flex-col items-center justify-center gap-4 py-12 px-6">
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  All tutorials completed!
                </h3>
                <p className="text-sm text-muted-foreground">
                  You've finished all the videos. Great job!
                </p>
              </div>
              <Button onClick={handleWatchAgain} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Watch Again
              </Button>
            </Card>
          ) : (
            <>
              <VideoPlayer
                sources={currentItem.sources}
                poster={currentItem.poster}
                autoPlay={autoplay}
                onNext={hasNext ? playlistActions.next : undefined}
                onPrevious={hasPrevious ? playlistActions.previous : undefined}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                preloadSrc={nextItem?.sources[0]?.src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
              />

              <PlayerControls
                autoplay={autoplay}
                onAutoplayChange={handleAutoplayChange}
                onNext={hasNext ? playlistActions.next : undefined}
                onPrevious={hasPrevious ? playlistActions.previous : undefined}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
              />
            </>
          )}

          <Checklist title="Tutorial Checklist" items={checklistItems} />
        </div>
      </ScrollArea>

      <VideoFooter />
    </div>
  );
}
