import { Volume2, Volume1, VolumeX } from "lucide-react";

interface VideoVolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export function VideoVolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }: VideoVolumeControlProps) {
  const effectiveVolume = isMuted ? 0 : volume;
  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-1.5 group/volume">
      <button
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="p-1 hover:text-primary transition-colors"
      >
        <VolumeIcon className="w-4 h-4" />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={effectiveVolume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        aria-label="Volume"
        className="w-0 group-hover/volume:w-16 transition-all duration-200 accent-primary h-1 cursor-pointer opacity-0 group-hover/volume:opacity-100"
      />
    </div>
  );
}
