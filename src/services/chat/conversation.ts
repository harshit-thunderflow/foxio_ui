import { API_BASE_URL } from "../api";
import { tokenStorage } from "../token";
import type {
  CreateConversationRequest,
  Conversation,
  Message,
} from "./types";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${tokenStorage.getToken()}`,
});

export async function createConversation(
  data: CreateConversationRequest
): Promise<Conversation> {
  const res = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create conversation" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to create conversation");
  }

  return res.json();
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE_URL}/conversations`, {
    headers: headers(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch conversations" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to fetch conversations");
  }

  return res.json();
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const res = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}/messages`,
    { headers: headers() }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch messages" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to fetch messages");
  }

  return res.json();
}
