import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Maximize, Minimize } from "lucide-react";
import { VideoSeekBar } from "./VideoSeekBar";
import { VideoVolumeControl } from "./VideoVolumeControl";
import type { VideoPlayerState, VideoPlayerActions } from "../../hooks";

interface VideoControlsBarProps {
  state: VideoPlayerState;
  actions: VideoPlayerActions;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoControlsBar({ state, actions }: VideoControlsBarProps) {
  const [visible, setVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showControls = useCallback(() => {
    setVisible(true);
    if (hideTimeout) clearTimeout(hideTimeout);
    if (state.isPlaying) {
      setHideTimeout(setTimeout(() => setVisible(false), 3000));
    }
  }, [state.isPlaying, hideTimeout]);

  useEffect(() => {
    if (!state.isPlaying) {
      setVisible(true);
      if (hideTimeout) clearTimeout(hideTimeout);
    } else {
      setHideTimeout(setTimeout(() => setVisible(false), 3000));
    }
    return () => { if (hideTimeout) clearTimeout(hideTimeout); };
  }, [state.isPlaying]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          actions.togglePlay();
          break;
        case "m":
          actions.toggleMute();
          break;
        case "f":
          actions.toggleFullscreen();
          break;
      }
    },
    [actions]
  );

  return (
    <div
      onPointerMove={showControls}
      onPointerEnter={showControls}
      onTouchStart={showControls}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="toolbar"
      aria-label="Video controls"
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2.5 pt-8 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"} group-hover/player:opacity-100 group-hover/player:pointer-events-auto`}
    >
      <VideoSeekBar
        progress={state.progress}
        buffered={state.buffered}
        onSeek={actions.seekByPercent}
      />
      <div className="flex items-center justify-between mt-2 text-white text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={actions.togglePlay}
            aria-label={state.isPlaying ? "Pause" : "Play"}
            className="p-1 hover:text-primary transition-colors"
          >
            {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <VideoVolumeControl
            volume={state.volume}
            isMuted={state.isMuted}
            onVolumeChange={actions.setVolume}
            onToggleMute={actions.toggleMute}
          />
          <span className="text-[11px] tabular-nums" aria-live="off" aria-label="Playback time">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </span>
        </div>
        <button
          onClick={actions.toggleFullscreen}
          aria-label={state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="p-1 hover:text-primary transition-colors"
        >
          {state.isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
