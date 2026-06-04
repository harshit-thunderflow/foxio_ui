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
  created_at: string;
  updated_at: string;
}

export async function fetchVideosApi(): Promise<Video[]> {
  const res = await authFetch("/videos");
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
