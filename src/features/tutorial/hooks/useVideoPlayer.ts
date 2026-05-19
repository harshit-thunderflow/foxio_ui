import { useRef, useState, useCallback, useEffect } from "react";

export type VideoErrorType = "network" | "decode" | "format" | "notfound" | "unknown";

export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isBuffering: boolean;
  isFullscreen: boolean;
  hasError: boolean;
  errorMessage: string;
  errorType: VideoErrorType | null;
  retryCount: number;
  currentTime: number;
  duration: number;
  volume: number;
  progress: number;
  buffered: number;
}

export interface VideoPlayerActions {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  seekByPercent: (percent: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  retry: () => void;
}

const MAX_RETRIES = 3;
const STALL_TIMEOUT_MS = 15000;
const LOAD_TIMEOUT_MS = 20000;

function getErrorDetails(video: HTMLVideoElement): { message: string; type: VideoErrorType } {
  const code = video.error?.code;
  switch (code) {
    case MediaError.MEDIA_ERR_ABORTED:
      return { message: "Playback was aborted.", type: "unknown" };
    case MediaError.MEDIA_ERR_NETWORK:
      return { message: "A network error occurred. Please check your connection.", type: "network" };
    case MediaError.MEDIA_ERR_DECODE:
      return { message: "The video could not be decoded. The file may be corrupted.", type: "decode" };
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return { message: "This video format is not supported by your browser.", type: "format" };
    default:
      return { message: "An unexpected error occurred during playback.", type: "unknown" };
  }
}

function logVideoError(errorType: VideoErrorType, message: string, retryCount: number, src?: string) {
  console.error(`[VideoPlayer] Error — type: ${errorType}, message: ${message}, retries: ${retryCount}, src: ${src ?? "unknown"}`);
}

interface UseVideoPlayerOptions {
  onEnded?: () => void;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const { onEnded } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    isMuted: false,
    isBuffering: false,
    isFullscreen: false,
    hasError: false,
    errorMessage: "",
    errorType: null,
    retryCount: 0,
    currentTime: 0,
    duration: 0,
    volume: 1,
    progress: 0,
    buffered: 0,
  });

  const clearStallTimer = useCallback(() => {
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
  }, []);

  const clearLoadTimer = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, []);

  const startStallTimer = useCallback(() => {
    clearStallTimer();
    stallTimerRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused && video.readyState < 3) {
        const msg = "Video stalled. The connection may be too slow.";
        logVideoError("network", msg, retryCountRef.current, video.currentSrc);
        setState((s) => ({
          ...s,
          hasError: true,
          errorMessage: msg,
          errorType: "network",
          isBuffering: false,
          isPlaying: false,
        }));
      }
    }, STALL_TIMEOUT_MS);
  }, [clearStallTimer]);

  const setError = useCallback((message: string, type: VideoErrorType) => {
    logVideoError(type, message, retryCountRef.current, videoRef.current?.currentSrc);
    setState((s) => ({
      ...s,
      hasError: true,
      errorMessage: message,
      errorType: type,
      isPlaying: false,
      isBuffering: false,
      retryCount: retryCountRef.current,
    }));
  }, []);

  const play = useCallback(() => {
    videoRef.current?.play().catch((err) => {
      if (err.name === "NotAllowedError") return;
      setError("Failed to start playback. The source may be unavailable.", "unknown");
    });
  }, [setError]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.paused ? play() : pause();
  }, [play, pause]);

  const seek = useCallback((time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(time, videoRef.current.duration || 0));
  }, []);

  const seekByPercent = useCallback((percent: number) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    seek((percent / 100) * videoRef.current.duration);
  }, [seek]);

  const setVolume = useCallback((volume: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(1, volume));
    videoRef.current.volume = clamped;
    videoRef.current.muted = clamped === 0;
    setState((s) => ({ ...s, volume: clamped, isMuted: clamped === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setState((s) => ({ ...s, isMuted: videoRef.current!.muted }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  }, []);

  const retry = useCallback(() => {
    if (!videoRef.current) return;
    if (retryCountRef.current >= MAX_RETRIES) {
      setError("Maximum retry attempts reached. Please try again later.", "unknown");
      return;
    }
    retryCountRef.current += 1;
    clearLoadTimer();
    setState((s) => ({
      ...s,
      hasError: false,
      errorMessage: "",
      errorType: null,
      retryCount: retryCountRef.current,
    }));
    videoRef.current.load();
    // Restart load timeout for retry
    loadTimerRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (video && video.readyState === 0) {
        const msg = navigator.onLine
          ? "Video failed to load. The source may be unavailable."
          : "You are offline. Please check your internet connection.";
        setError(msg, "network");
      }
    }, LOAD_TIMEOUT_MS);
  }, [setError, clearLoadTimer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Load timeout — if metadata never loads, trigger error
    loadTimerRef.current = setTimeout(() => {
      if (video.readyState === 0) {
        const msg = navigator.onLine
          ? "Video failed to load. The source may be unavailable."
          : "You are offline. Please check your internet connection.";
        setError(msg, "network");
      }
    }, LOAD_TIMEOUT_MS);

    const handlers: Record<string, () => void> = {
      play: () => {
        clearStallTimer();
        setState((s) => ({ ...s, isPlaying: true }));
      },
      pause: () => {
        clearStallTimer();
        setState((s) => ({ ...s, isPlaying: false }));
      },
      waiting: () => {
        setState((s) => ({ ...s, isBuffering: true }));
        startStallTimer();
      },
      canplay: () => {
        clearStallTimer();
        setState((s) => ({ ...s, isBuffering: false }));
      },
      loadedmetadata: () => {
        clearLoadTimer();
        setState((s) => ({ ...s, duration: video.duration }));
      },
      timeupdate: () => {
        clearStallTimer();
        const progress = video.duration ? (video.currentTime / video.duration) * 100 : 0;
        setState((s) => ({ ...s, currentTime: video.currentTime, progress }));
      },
      progress: () => {
        if (video.buffered.length > 0) {
          const buffered = (video.buffered.end(video.buffered.length - 1) / (video.duration || 1)) * 100;
          setState((s) => ({ ...s, buffered }));
        }
      },
      error: () => {
        clearStallTimer();
        clearLoadTimer();
        const { message, type } = getErrorDetails(video);
        setError(message, type);
      },
      stalled: () => {
        startStallTimer();
      },
      ended: () => {
        clearStallTimer();
        setState((s) => ({ ...s, isPlaying: false }));
        onEnded?.();
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => video.addEventListener(event, handler));

    const onFullscreenChange = () => {
      setState((s) => ({ ...s, isFullscreen: !!document.fullscreenElement }));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);

    // Listen for browser going offline during playback
    const onOffline = () => {
      if (!video.paused || video.readyState < 3) {
        setError("You are offline. Please check your internet connection.", "network");
        video.pause();
      }
    };
    window.addEventListener("offline", onOffline);

    return () => {
      clearStallTimer();
      clearLoadTimer();
      Object.entries(handlers).forEach(([event, handler]) => video.removeEventListener(event, handler));
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("offline", onOffline);
    };
  }, [clearStallTimer, clearLoadTimer, startStallTimer, setError]);

  const actions: VideoPlayerActions = {
    play, pause, togglePlay, seek, seekByPercent, setVolume, toggleMute, toggleFullscreen, retry,
  };

  return { videoRef, containerRef, state, actions };
}
