import { useState } from "react";
import { ContextLabel } from "@/components/common/ContextLabel";
import {
  SectionHeading,
  ProgressRail,
  VideoPlayer,
  PlayerControls,
  Checklist,
  VideoFooter,
} from "./components";
import type { VideoSource } from "./components";
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

const videoSources: VideoSource[] = [
  { src: "https://www.w3schools.com/html/mov_bbb.mp4", type: "video/mp4" },
  { src: "https://www.w3schools.com/html/mov_bbb.webm", type: "video/webm" },
];



export function TutorialPage() {
  const [autoplay, setAutoplay] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6">
        <ContextLabel
          text="Currently viewing: Getting Started Guide"
          onDismiss={() => {}}
        />

        <SectionHeading
          title="Watch Tutorial"
          description="Learn how to streamline your workflow with our Foxio assistant."
          completed={2}
          total={4}
        />

        <ProgressRail steps={steps} />

        <VideoPlayer
          sources={videoSources}
          poster="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80"
          autoPlay={autoplay}
        />

        <PlayerControls
          autoplay={autoplay}
          onAutoplayChange={setAutoplay}
        />

        <Checklist title="Tutorial Checklist" items={checklistItems} />
      </div>

      {/* Footer */}
      <VideoFooter />
    </div>
  );
}
