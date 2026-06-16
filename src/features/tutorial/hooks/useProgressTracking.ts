import { useRef, useCallback, useEffect } from "react";
import { updateVideoProgressApi, completeVideoApi } from "@/services/video";

const PROGRESS_INTERVAL_MS = 10000;

interface UseProgressTrackingOptions {
  videoId: string | undefined;
  getPlayerState: () => { currentTime: number; duration: number; isPlaying: boolean };
  onCompleted?: () => void;
}

export function useProgressTracking({
  videoId,
  getPlayerState,
  onCompleted,
}: UseProgressTrackingOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSentRef = useRef(0);
  const videoIdRef = useRef(videoId);
  const onCompletedRef = useRef(onCompleted);
  videoIdRef.current = videoId;
  onCompletedRef.current = onCompleted;

  const sendProgress = useCallback(async () => {
    const id = videoIdRef.current;
    if (!id) return;
    const { currentTime } = getPlayerState();
    if (currentTime <= 0 || Math.abs(currentTime - lastSentRef.current) < 2) return;
    lastSentRef.current = currentTime;
    try {
      await updateVideoProgressApi(id, Math.floor(currentTime));
    } catch {
      // Non-critical, fail silently
    }
  }, [getPlayerState]);

  // Periodic progress sync while playing
  useEffect(() => {
    if (!videoId) return;

    intervalRef.current = setInterval(() => {
      const { isPlaying } = getPlayerState();
      if (isPlaying) sendProgress();
    }, PROGRESS_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Send final progress on video change/unmount
      sendProgress();
    };
  }, [videoId, sendProgress, getPlayerState]);

  // Reset tracking state on video change
  useEffect(() => {
    lastSentRef.current = 0;
  }, [videoId]);

  // Mark video as complete — always fires the API call
  const markComplete = useCallback(async (completedVideoId?: string) => {
    const id = completedVideoId || videoIdRef.current;
    if (!id) return;
    try {
      await completeVideoApi(id);
      onCompletedRef.current?.();
    } catch (err) {
      console.warn("[useProgressTracking] Failed to mark video complete:", id, err);
    }
  }, []);

  return { sendProgress, markComplete };
}
