import { API_BASE_URL } from "../api";
import { tokenStorage } from "../token";
import type { CreateContextSnapshotRequest, ContextSnapshot } from "./types";

export async function createContextSnapshot(
  data: CreateContextSnapshotRequest
): Promise<ContextSnapshot> {
  const res = await fetch(`${API_BASE_URL}/context/snapshot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenStorage.getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to store context" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to store context");
  }

  return res.json();
}
