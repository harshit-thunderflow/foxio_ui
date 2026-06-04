import { useState, useEffect, useCallback } from "react";
import { fetchVideosApi, fetchVideoByIdApi, type Video } from "@/services/video";
import { useAuth } from "./useAuth";

export function useVideos() {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      setVideos(await fetchVideosApi());
    } catch (err: any) {
      setError(err.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, loading, error, refetch: fetchVideos };
}

export function useVideo(videoId: string | undefined) {
  const { isAuthenticated } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = useCallback(async () => {
    if (!isAuthenticated || !videoId) return;
    setLoading(true);
    setError(null);
    try {
      setVideo(await fetchVideoByIdApi(videoId));
    } catch (err: any) {
      setError(err.message || "Failed to fetch video");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, videoId]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return { video, loading, error, refetch: fetchVideo };
}
