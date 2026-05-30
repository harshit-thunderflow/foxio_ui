import { useState, useCallback } from "react";
import {
  createConversation,
  getConversations,
  getMessages,
  createContextSnapshot,
  sendMessage,
  sendFeedback,
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

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getConversations();
      setConversations(list);
      return list;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      return msgs;
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
  };
}
