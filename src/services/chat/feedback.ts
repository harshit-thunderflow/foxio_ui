import { authFetch } from "../authFetch";
import type { SendFeedbackRequest, FeedbackResponse } from "./types";

export async function sendFeedback(
  messageId: string,
  data: SendFeedbackRequest
): Promise<FeedbackResponse> {
  const res = await authFetch(`/messages/${messageId}/feedback`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to send feedback" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to send feedback");
  }

  return res.json();
}
