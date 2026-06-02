import { authFetch } from "../authFetch";
import type { SendMessageRequest, ChatResponse } from "./types";

export async function sendMessage(
  data: SendMessageRequest
): Promise<ChatResponse> {
  const res = await authFetch("/chat/message", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to send message" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to send message");
  }

  return res.json();
}
