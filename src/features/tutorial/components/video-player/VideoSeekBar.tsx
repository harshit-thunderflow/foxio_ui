import { useCallback, useRef, useState } from "react";

interface VideoSeekBarProps {
  progress: number;
  buffered: number;
  onSeek: (percent: number) => void;
}

export function VideoSeekBar({ progress, buffered, onSeek }: VideoSeekBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getPercent = useCallback((clientX: number) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      barRef.current?.setPointerCapture(e.pointerId);
      onSeek(getPercent(e.clientX));
    },
    [onSeek, getPercent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      onSeek(getPercent(e.clientX));
    },
    [isDragging, onSeek, getPercent]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") onSeek(Math.min(100, progress + 2));
      else if (e.key === "ArrowLeft") onSeek(Math.max(0, progress - 2));
    },
    [onSeek, progress]
  );

  return (
    <div
      ref={barRef}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={`group relative w-full cursor-pointer rounded-full touch-none flex items-center ${isDragging ? "h-5" : "h-4 hover:h-5"}`}
    >
      {/* Track */}
      <div className={`relative w-full rounded-full bg-white/20 ${isDragging ? "h-2.5" : "h-1.5 group-hover:h-2.5"} transition-all`}>
        {/* Buffered */}
        <div
          className="absolute inset-y-0 left-0 bg-white/30 rounded-full pointer-events-none"
          style={{ width: `${buffered}%` }}
        />
        {/* Progress */}
        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-full pointer-events-none"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Thumb — positioned relative to outer container for stable centering */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full transition-opacity shadow pointer-events-none ${isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        style={{ left: `${progress}%` }}
      />
    </div>
  );
}
