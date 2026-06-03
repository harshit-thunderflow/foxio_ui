import { authFetch } from "./authFetch";

export interface UploadResponse {
  success: boolean;
  type: string;
  filename: string;
  original_filename: string;
  url: string;
  uploaded_at: string;
}

export async function uploadFileApi(file: File, type: string = "profile_picture"): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await authFetch("/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    const msg = Array.isArray(err.detail)
      ? err.detail.map((d: any) => d.msg).join(", ")
      : err.detail || "Upload failed";
    throw new Error(msg);
  }

  return res.json();
}
