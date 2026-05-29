import { API_BASE_URL } from "./api";
import { tokenStorage } from "./token";

export interface UserMe {
  id: string;
  email: string;
  role: string;
  status: string;
  team_id: string;
  created_at: string;
}

export async function fetchUserMeApi(): Promise<UserMe> {
  const token = tokenStorage.getToken();

  const res = await fetch(`${API_BASE_URL}/users/me`, {
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
    const err = await res.json().catch(() => ({ detail: "Failed to fetch user" }));
    throw new Error(err.detail || "Failed to fetch user");
  }

  return res.json();
}
