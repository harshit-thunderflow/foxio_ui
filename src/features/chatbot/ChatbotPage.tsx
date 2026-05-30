import { useState, useEffect, useCallback } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { ContextLabel } from "@/components/common/ContextLabel";
import { ConversationHistory, ConversationChat } from "./components";
import { useChat } from "@/hooks";
import type { Conversation } from "@/services/chat";

type View = "history" | "chat";

const STORAGE_KEY = "foxio-active-chat";

function getSavedState(): { view: View; conversation: Conversation | null; isNewChat: boolean } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { view: "history", conversation: null, isNewChat: false };
}

function saveState(view: View, conversation: Conversation | null, isNewChat: boolean) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ view, conversation, isNewChat }));
}

function clearState() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function ChatbotPage() {
  const { conversations, fetchConversations, loading } = useChat();

  const saved = getSavedState();
  const [view, setView] = useState<View>(saved.view);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(saved.conversation);
  const [isNewChat, setIsNewChat] = useState(saved.isNewChat);

  useEffect(() => {
    fetchConversations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback((conv: Conversation) => {
    setSelectedConversation(conv);
    setIsNewChat(false);
    setView("chat");
    saveState("chat", conv, false);
  }, []);

  const handleNewChat = useCallback(() => {
    setSelectedConversation(null);
    setIsNewChat(true);
    setView("chat");
    saveState("chat", null, true);
  }, []);

  const handleBack = useCallback(() => {
    setView("history");
    setSelectedConversation(null);
    setIsNewChat(false);
    clearState();
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {view === "history" && (
        <>
          <div className="shrink-0 px-3 pt-2 space-y-2">
            <PageTitle name="Chatbot" />
            <ContextLabel />
          </div>
          <div className="flex-1 overflow-hidden">
            <ConversationHistory
              conversations={conversations}
              loading={loading}
              onSelect={handleSelect}
              onNewChat={handleNewChat}
            />
          </div>
        </>
      )}

      {view === "chat" && (
        <ConversationChat
          conversation={selectedConversation}
          isNewChat={isNewChat}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
