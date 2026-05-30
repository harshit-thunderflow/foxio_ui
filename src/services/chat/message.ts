import { API_BASE_URL } from "../api";
import { tokenStorage } from "../token";
import type { SendMessageRequest, ChatResponse } from "./types";

export async function sendMessage(
  data: SendMessageRequest
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenStorage.getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to send message" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to send message");
  }

  return res.json();
}
