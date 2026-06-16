import { authFetch } from "./authFetch";

export interface Video {
  id: string;
  organization_id: number;
  team_id: string;
  created_by: string;
  title: string;
  description: string;
  website_url: string;
  status: string;
  azure_blob_name: string;
  video_url: string;
  thumbnail_url: string;
  mime_type: string;
  file_size: number;
  duration: number;
  order: number;
  step_label: string;
  checklist_text: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface VideoFilters {
  category?: string;
  search?: string;
  tags?: string[];
}

export interface UpdateVideoPayload {
  title?: string;
  description?: string;
  status?: string;
  video_url?: string;
  thumbnail_url?: string;
  azure_blob_name?: string;
  mime_type?: string;
  file_size?: number;
  duration?: number;
  order?: number;
  step_label?: string;
  checklist_text?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateProgressResponse {
  video_id: string;
  progress_seconds: number;
  progress_percent: number;
  status: string;
  completed_at: string | null;
}

export interface CompleteVideoResponse {
  video_id: string;
  status: string;
  completed_at: string;
}

export interface VideoProgressItem {
  video_id: string;
  title: string;
  order: number;
  step_label: string;
  checklist_text: string;
  status: string;
  progress_seconds: number;
  progress_percent: number;
  completed_at: string | null;
  last_watched_at: string | null;
}

export interface VideoProgress {
  total_videos: number;
  completed_count: number;
  items: VideoProgressItem[];
}

export async function fetchVideosApi(filters?: VideoFilters): Promise<Video[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.tags?.length) filters.tags.forEach((t) => params.append("tags", t));

  const query = params.toString();
  const res = await authFetch(`/videos${query ? `?${query}` : ""}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch videos" }));
    throw new Error(err.detail || "Failed to fetch videos");
  }
  return res.json();
}

export async function fetchVideoByIdApi(videoId: string): Promise<Video> {
  const res = await authFetch(`/videos/${videoId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch video" }));
    const msg = Array.isArray(err.detail)
      ? err.detail.map((d: any) => d.msg).join(", ")
      : err.detail || "Failed to fetch video";
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchVideoProgressApi(): Promise<VideoProgress> {
  const res = await authFetch("/videos/progress");
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch progress" }));
    throw new Error(err.detail || "Failed to fetch progress");
  }
  return res.json();
}

export async function fetchVideoCategoriesApi(): Promise<string[]> {
  const res = await authFetch("/videos/categories");
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch categories" }));
    throw new Error(err.detail || "Failed to fetch categories");
  }
  return res.json();
}

export async function updateVideoApi(videoId: string, payload: UpdateVideoPayload): Promise<Video> {
  const res = await authFetch(`/videos/${videoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update video" }));
    const msg = Array.isArray(err.detail)
      ? err.detail.map((d: any) => d.msg).join(", ")
      : err.detail || "Failed to update video";
    throw new Error(msg);
  }
  return res.json();
}

export async function updateVideoProgressApi(videoId: string, progressSeconds: number): Promise<UpdateProgressResponse> {
  const res = await authFetch(`/videos/${videoId}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progress_seconds: progressSeconds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update progress" }));
    const msg = Array.isArray(err.detail)
      ? err.detail.map((d: any) => d.msg).join(", ")
      : err.detail || "Failed to update progress";
    throw new Error(msg);
  }
  return res.json();
}

export async function completeVideoApi(videoId: string): Promise<CompleteVideoResponse> {
  const res = await authFetch(`/videos/${videoId}/complete`, {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to complete video" }));
    const msg = Array.isArray(err.detail)
      ? err.detail.map((d: any) => d.msg).join(", ")
      : err.detail || "Failed to complete video";
    throw new Error(msg);
  }
  return res.json();
}
