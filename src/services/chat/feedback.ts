import { API_BASE_URL } from "../api";
import { tokenStorage } from "../token";
import type { SendFeedbackRequest, FeedbackResponse } from "./types";

export async function sendFeedback(
  messageId: string,
  data: SendFeedbackRequest
): Promise<FeedbackResponse> {
  const res = await fetch(
    `${API_BASE_URL}/messages/${messageId}/feedback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenStorage.getToken()}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to send feedback" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to send feedback");
  }

  return res.json();
}
