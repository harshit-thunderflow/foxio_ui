import { useState, useMemo, useCallback, useRef } from "react";
import { SearchBar, CategoryPills, VideoCard, LibrarySkeleton } from "./components";
import { VideoPlayerModal } from "./components/VideoPlayerModal";
import { usePageTitle, useVideos, useVideoCategories } from "@/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LibraryPage() {
  usePageTitle("Library");

  const { videos, loading: videosLoading, error } = useVideos();
  const { categories, loading: categoriesLoading } = useVideoCategories();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInitialLoad = videos.length === 0 && (videosLoading || categoriesLoading);

  const allCategories = useMemo(() => ["All", ...categories], [categories]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 400);
  }, []);

  // Client-side filtering
  const filteredVideos = useMemo(() => {
    let result = videos;
    if (activeCategory !== "All") {
      result = result.filter((v) => v.category === activeCategory);
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [videos, activeCategory, debouncedSearch]);

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const handleVideoClick = useCallback((videoId: string) => {
    setActiveVideoId(videoId);
  }, []);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Show skeleton until data is ready
  if (isInitialLoad) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 px-4 pt-2">
          <LibrarySkeleton />
        </ScrollArea>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden p-4 sm:p-6">
      {/* Search + Filters */}
      <div className="shrink-0 space-y-3 px-4 pt-2">
        <SearchBar value={searchQuery} onChange={handleSearch} />
        <CategoryPills
          categories={allCategories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Scrollable Video List */}
      <ScrollArea className="flex-1 px-4 pt-4">
        {filteredVideos.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            No videos found.
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={{
                  id: video.id,
                  title: video.title,
                  description: video.description,
                  thumbnail: video.thumbnail_url,
                  duration: formatDuration(video.duration || 0),
                  category: video.category,
                  tags: video.tags,
                }}
                onClick={() => handleVideoClick(video.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {activeVideoId && (
        <VideoPlayerModal
          videos={filteredVideos}
          initialVideoId={activeVideoId}
          onClose={() => setActiveVideoId(null)}
        />
      )}
    </div>
  );
}
