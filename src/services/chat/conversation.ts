import { authFetch } from "../authFetch";
import type {
  CreateConversationRequest,
  Conversation,
  ConversationDetail,
  UpdateConversationRequest,
  GetConversationsParams,
  PaginatedConversationsResponse,
  GetMessagesParams,
  PaginatedMessagesResponse,
} from "./types";

export async function createConversation(
  data: CreateConversationRequest
): Promise<Conversation> {
  const res = await authFetch("/conversations", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create conversation" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to create conversation");
  }

  return res.json();
}

export async function getConversations(
  params: GetConversationsParams = {}
): Promise<PaginatedConversationsResponse> {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("page_size", String(params.page_size ?? 10));
  if (params.archived) searchParams.set("archived", "true");

  const res = await authFetch(`/conversations?${searchParams.toString()}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch conversations" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to fetch conversations");
  }

  return res.json();
}

export async function getMessages(
  conversationId: string,
  params: GetMessagesParams = {}
): Promise<PaginatedMessagesResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("page_size", String(params.page_size ?? 50));

  const res = await authFetch(
    `/conversations/${conversationId}/messages?${searchParams.toString()}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch messages" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to fetch messages");
  }

  return res.json();
}

export async function getConversation(
  conversationId: string
): Promise<ConversationDetail> {
  const res = await authFetch(`/conversations/${conversationId}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch conversation" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to fetch conversation");
  }

  return res.json();
}

export async function updateConversation(
  conversationId: string,
  data: UpdateConversationRequest
): Promise<Conversation> {
  const res = await authFetch(`/conversations/${conversationId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update conversation" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to update conversation");
  }

  return res.json();
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  const res = await authFetch(`/conversations/${conversationId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to delete conversation" }));
    throw new Error(err.detail?.[0]?.msg || "Failed to delete conversation");
  }
}
