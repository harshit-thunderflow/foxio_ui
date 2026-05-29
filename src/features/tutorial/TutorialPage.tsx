import { useState } from "react";
import { ContextLabel } from "@/components/common/ContextLabel";
import { PageTitle } from "@/components/common/PageTitle";
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

const playlist: PlaylistItem[] = [
  {
    id: "1",
    title: "Introduction to Foxio",
    sources: [
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", type: "video/mp4" },
    ],
    poster: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
  },
  {
    id: "2",
    title: "Setting Up Your Workspace",
    sources: [
      { src: "https://www.w3schools.com/html/movie.mp4", type: "video/mp4" },
    ],
    poster: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  },
  {
    id: "3",
    title: "Advanced Usage Tips",
    sources: [
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", type: "video/mp4" },
    ],
    poster: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
  },
  {
    id: "4",
    title: "Integrations & Plugins",
    sources: [
      { src: "https://www.w3schools.com/html/movie.mp4", type: "video/mp4" },
    ],
    poster: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
];

export function TutorialPage() {
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem("foxio-autoplay") === "true");

  const handleAutoplayChange = (value: boolean) => {
    setAutoplay(value);
    localStorage.setItem("foxio-autoplay", String(value));
  };
  const { state: playlistState, actions: playlistActions, nextItem } = usePlaylist(playlist);
  const { currentItem, hasNext, hasPrevious, currentIndex, total } = playlistState;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <PageTitle name="Tutorial" />
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

      {/* Footer */}
      <VideoFooter />
    </div>
  );
}
