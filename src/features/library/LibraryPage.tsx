import { useState } from "react";
import { SearchBar, CategoryPills, VideoCard, LibraryFooterNav } from "./components";
import { usePageTitle } from "@/hooks";
import type { VideoCardData } from "./components/VideoCard";

const categories = ["All", "Setup", "Automation", "Sync", "Advanced"];

const videos: VideoCardData[] = [
  {
    id: "1",
    title: "Configuring Your Core Automation",
    description: "Learn how to map your first trigger-action workflow...",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    duration: "4:32",
    transcript: {
      label: "Transcript highlight",
      quote: "...drag the trigger node into the automation canvas to start...",
    },
  },
  {
    id: "2",
    title: "Data Sync Essentials",
    description: "Mastering real-time synchronization between modules...",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    duration: "6:15",
  },
  {
    id: "3",
    title: "Introduction to Foxio AI",
    description: "A complete overview of the assistant's capabilities...",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    duration: "3:48",
  },
];

export function LibraryPage() {
  usePageTitle("Library");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search + Filters */}
      <div className="shrink-0 space-y-3">
        <SearchBar />
        <CategoryPills
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Scrollable Video List */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Footer Nav */}
      <LibraryFooterNav />
    </div>
  );
}
