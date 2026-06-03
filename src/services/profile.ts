import { authFetch } from "./authFetch";

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  profile_image?: string;
}

export async function updateProfileApi(data: UpdateProfileRequest): Promise<UserProfile> {
  const res = await authFetch("/users/me/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update profile" }));
    const msg = Array.isArray(err.detail)
      ? err.detail.map((d: any) => d.msg).join(", ")
      : err.detail || "Failed to update profile";
    throw new Error(msg);
  }

  return res.json();
}

export async function fetchProfileApi(): Promise<UserProfile> {
  const res = await authFetch("/users/me/profile");

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch profile" }));
    throw new Error(err.detail || "Failed to fetch profile");
  }

  return res.json();
}
