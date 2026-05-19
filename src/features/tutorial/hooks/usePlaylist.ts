import { useState, useCallback, useMemo } from "react";

export interface PlaylistItem {
  id: string;
  title: string;
  sources: { src: string; type: "video/mp4" | "video/webm" }[];
  poster?: string;
}

export interface PlaylistState {
  currentIndex: number;
  currentItem: PlaylistItem;
  hasPrevious: boolean;
  hasNext: boolean;
  total: number;
}

export interface PlaylistActions {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
}

export function usePlaylist(items: PlaylistItem[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const next = useCallback(() => {
    setCurrentIndex((i) => (i < items.length - 1 ? i + 1 : i));
  }, [items.length]);

  const previous = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < items.length) setCurrentIndex(index);
  }, [items.length]);

  const state: PlaylistState = useMemo(() => ({
    currentIndex,
    currentItem: items[currentIndex],
    hasPrevious,
    hasNext,
    total: items.length,
  }), [currentIndex, items, hasPrevious, hasNext]);

  const actions: PlaylistActions = useMemo(() => ({ next, previous, goTo }), [next, previous, goTo]);

  // Next item for optional preloading
  const nextItem = hasNext ? items[currentIndex + 1] : null;

  return { state, actions, nextItem };
}
