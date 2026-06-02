import { authFetch } from "./authFetch";

export interface UserMe {
  id: string;
  email: string;
  role: string;
  status: string;
  team_id: string;
  created_at: string;
}

export async function fetchUserMeApi(): Promise<UserMe> {
  const res = await authFetch("/users/me");

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch user" }));
    throw new Error(err.detail || "Failed to fetch user");
  }

  return res.json();
}
