import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface VideoCardData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  transcript?: { label: string; quote: string };
}

interface VideoCardProps {
  video: VideoCardData;
  onClick?: () => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <Card
      onClick={onClick}
      className="p-0 gap-0 cursor-pointer hover:shadow-md transition-shadow bg-card"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover rounded-t-xl"
        />
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-foreground/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-0 h-0 border-l-[10px] sm:border-l-[12px] border-l-primary-foreground border-t-[6px] sm:border-t-[8px] border-t-transparent border-b-[6px] sm:border-b-[8px] border-b-transparent ml-0.5" />
        </div>
        {/* Duration badge */}
        <Badge className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-background/80 text-foreground border-border text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-1 sm:px-1.5 py-px">
          {video.duration}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="flex flex-col gap-0.5 sm:gap-1 p-2.5 sm:p-3 md:p-4">
        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-foreground tracking-tight line-clamp-1">
          {video.title}
        </h3>
        <p className="text-[11px] sm:text-xs md:text-[13px] text-muted-foreground leading-snug line-clamp-2">
          {video.description}
        </p>

        {/* Transcript snippet */}
        {video.transcript && (
          <div className="mt-1.5 sm:mt-2 p-1.5 sm:p-2 md:p-3 bg-muted/50 border border-border rounded-lg space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1">
              <BookOpen className="w-2.5 h-2.5 text-primary" />
              <span className="text-[10px] sm:text-[11px] font-medium text-primary">
                {video.transcript.label}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] italic text-muted-foreground leading-snug line-clamp-2">
              "{video.transcript.quote}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
