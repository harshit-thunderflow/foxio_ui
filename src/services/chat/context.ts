import { authFetch } from "../authFetch";
import type { CreateContextSnapshotRequest, ContextSnapshot } from "./types";

export async function createContextSnapshot(
  data: CreateContextSnapshotRequest
): Promise<ContextSnapshot> {
  const res = await authFetch("/context/snapshot", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to store context" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to store context");
  }

  return res.json();
}
