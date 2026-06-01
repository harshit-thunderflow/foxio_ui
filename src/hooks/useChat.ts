import { useState, useCallback } from "react";
import {
  createConversation,
  getConversations,
  getMessages,
  createContextSnapshot,
  sendMessage,
  sendFeedback,
  updateConversation as updateConversationApi,
  deleteConversation as deleteConversationApi,
} from "@/services/chat";
import type {
  Conversation,
  Message,
  ChatResponse,
  ContextSnapshot,
  CreateConversationRequest,
  CreateContextSnapshotRequest,
  SendMessageRequest,
  SendFeedbackRequest,
  FeedbackResponse,
  GetConversationsParams,
  PaginatedConversationsResponse,
  GetMessagesParams,
  PaginatedMessagesResponse,
  UpdateConversationRequest,
} from "@/services/chat";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contextSnapshot, setContextSnapshot] = useState<ContextSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConversation = useCallback(
    async (data: CreateConversationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const conv = await createConversation(data);
        setConversation(conv);
        return conv;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchConversations = useCallback(async (params: GetConversationsParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedConversationsResponse = await getConversations(params);
      setConversations(data.items);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string, params: GetMessagesParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedMessagesResponse = await getMessages(conversationId, params);
      setMessages(data.items);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const storeContext = useCallback(
    async (data: CreateContextSnapshotRequest) => {
      setError(null);
      try {
        const snapshot = await createContextSnapshot(data);
        setContextSnapshot(snapshot);
        return snapshot;
      } catch (e: any) {
        setError(e.message);
        throw e;
      }
    },
    []
  );

  const send = useCallback(
    async (data: SendMessageRequest): Promise<ChatResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await sendMessage(data);
        return response;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const submitFeedback = useCallback(
    async (messageId: string, data: SendFeedbackRequest): Promise<FeedbackResponse> => {
      setError(null);
      try {
        return await sendFeedback(messageId, data);
      } catch (e: any) {
        setError(e.message);
        throw e;
      }
    },
    []
  );

  const patchConversation = useCallback(
    async (conversationId: string, data: UpdateConversationRequest): Promise<Conversation> => {
      setError(null);
      try {
        return await updateConversationApi(conversationId, data);
      } catch (e: any) {
        setError(e.message);
        throw e;
      }
    },
    []
  );

  const removeConversation = useCallback(
    async (conversationId: string): Promise<void> => {
      setError(null);
      try {
        await deleteConversationApi(conversationId);
        setConversations((prev) => prev.filter((c) => c.conversation_id !== conversationId));
      } catch (e: any) {
        setError(e.message);
        throw e;
      }
    },
    []
  );

  return {
    conversations,
    conversation,
    messages,
    contextSnapshot,
    loading,
    error,
    startConversation,
    fetchConversations,
    fetchMessages,
    storeContext,
    send,
    submitFeedback,
    patchConversation,
    removeConversation,
  };
}
