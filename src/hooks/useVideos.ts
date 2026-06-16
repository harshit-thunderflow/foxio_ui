import { useState, useEffect, useCallback } from "react";
import {
  fetchVideosApi,
  fetchVideoByIdApi,
  fetchVideoProgressApi,
  fetchVideoCategoriesApi,
  updateVideoApi,
  updateVideoProgressApi,
  completeVideoApi,
  type Video,
  type VideoFilters,
  type VideoProgress,
  type UpdateVideoPayload,
} from "@/services/video";
import { useAuth } from "./useAuth";

export function useVideos(filters?: VideoFilters) {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      setVideos(await fetchVideosApi(filters));
    } catch (err: any) {
      setError(err.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters?.category, filters?.search, filters?.tags?.join(",")]);

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

export function useVideoProgress() {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      setProgress(await fetchVideoProgressApi());
    } catch (err: any) {
      setError(err.message || "Failed to fetch progress");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, error, refetch: fetchProgress };
}

export function useVideoCategories() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      setCategories(await fetchVideoCategoriesApi());
    } catch (err: any) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

export function useUpdateVideo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateVideo = useCallback(async (videoId: string, payload: UpdateVideoPayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateVideoApi(videoId, payload);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to update video");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateVideo, loading, error };
}

export function useUpdateVideoProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useCallback(async (videoId: string, progressSeconds: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateVideoProgressApi(videoId, progressSeconds);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to update progress");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProgress, loading, error };
}

export function useCompleteVideo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeVideo = useCallback(async (videoId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await completeVideoApi(videoId);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to complete video");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { completeVideo, loading, error };
}
