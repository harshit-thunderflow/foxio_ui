import { API_BASE_URL } from "./api";
import { tokenStorage } from "./token";

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
}

export async function updateProfileApi(data: UpdateProfileRequest): Promise<UserProfile> {
  const token = tokenStorage.getToken();

  const res = await fetch(`${API_BASE_URL}/users/me/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    throw new Error("token expired");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update profile" }));
    throw new Error(err.detail || "Failed to update profile");
  }

  return res.json();
}

export async function fetchProfileApi(): Promise<UserProfile> {
  const token = tokenStorage.getToken();

  const res = await fetch(`${API_BASE_URL}/users/me/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error("token expired");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch profile" }));
    throw new Error(err.detail || "Failed to fetch profile");
  }

  return res.json();
}
