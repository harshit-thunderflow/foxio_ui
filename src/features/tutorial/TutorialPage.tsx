import { useState, useMemo } from "react";
import { ContextLabel } from "@/components/common/ContextLabel";
import { usePageTitle, useVideos } from "@/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SectionHeading,
  ProgressRail,
  VideoPlayer,
  PlayerControls,
  Checklist,
  VideoFooter,
} from "./components";
import { usePlaylist } from "./hooks";
import type { PlaylistItem } from "./hooks";
import type { ProgressStep } from "./components/ProgressRail";
import type { ChecklistItem } from "./components/Checklist";

const steps: ProgressStep[] = [
  { step: 1, label: "Intro", status: "done" },
  { step: 2, label: "Setup", status: "active" },
  { step: 3, label: "Usage", status: "pending" },
  { step: 4, label: "Tips", status: "pending" },
];

const checklistItems: ChecklistItem[] = [
  { id: "1", text: "Watch the intro", status: "done" },
  { id: "2", text: "Complete the setup guide", status: "active" },
  { id: "3", text: "Learn advanced usage tips", status: "pending" },
  { id: "4", text: "Explore integrations", status: "pending" },
];

// const playlist: PlaylistItem[] = [
//   {
//     id: "1",
//     title: "Introduction to Foxio",
//     sources: [
//       { src: "https://www.w3schools.com/html/mov_bbb.mp4", type: "video/mp4" },
//     ],
//     poster: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
//   },
//   {
//     id: "2",
//     title: "Setting Up Your Workspace",
//     sources: [
//       { src: "https://www.w3schools.com/html/movie.mp4", type: "video/mp4" },
//     ],
//     poster: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
//   },
//   {
//     id: "3",
//     title: "Advanced Usage Tips",
//     sources: [
//       { src: "https://www.w3schools.com/html/mov_bbb.mp4", type: "video/mp4" },
//     ],
//     poster: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
//   },
//   {
//     id: "4",
//     title: "Integrations & Plugins",
//     sources: [
//       { src: "https://www.w3schools.com/html/movie.mp4", type: "video/mp4" },
//     ],
//     poster: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
//   },
// ];

export function TutorialPage() {
  usePageTitle("Tutorial");
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem("foxio-autoplay") === "true");
  const { videos, loading, error } = useVideos();

  const playlist: PlaylistItem[] = useMemo(
    () =>
      videos.map((v) => ({
        id: v.id,
        title: v.title,
        sources: [{ src: v.video_url, type: (v.mime_type || "video/mp4") as "video/mp4" | "video/webm" }],
        poster: v.thumbnail_url || undefined,
      })),
    [videos]
  );

  const handleAutoplayChange = (value: boolean) => {
    setAutoplay(value);
    localStorage.setItem("foxio-autoplay", String(value));
  };
  const { state: playlistState, actions: playlistActions, nextItem } = usePlaylist(playlist);
  const { currentItem, hasNext, hasPrevious, currentIndex, total } = playlistState;

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  if (!playlist.length) return <div className="flex items-center justify-center h-full">No tutorials available.</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
        <ContextLabel />

        <SectionHeading
          title="Watch Tutorial"
          description="Learn how to streamline your workflow with our Foxio assistant."
          completed={currentIndex + 1}
          total={total}
        />

        <ProgressRail steps={steps} />

        <VideoPlayer
          sources={currentItem.sources}
          poster={currentItem.poster}
          autoPlay={autoplay}
          onNext={hasNext ? playlistActions.next : undefined}
          onPrevious={hasPrevious ? playlistActions.previous : undefined}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          preloadSrc={nextItem?.sources[0]?.src}
        />

        <PlayerControls
          autoplay={autoplay}
          onAutoplayChange={handleAutoplayChange}
          onNext={hasNext ? playlistActions.next : undefined}
          onPrevious={hasPrevious ? playlistActions.previous : undefined}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        />

        <Checklist title="Tutorial Checklist" items={checklistItems} />
        </div>
      </ScrollArea>

      {/* Footer */}
      <VideoFooter />
    </div>
  );
}
