import { useState, useEffect, useCallback } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { ContextLabel } from "@/components/common/ContextLabel";
import { RecentChats, ConversationHistoryFull, ConversationChat } from "./components";
import { useChat } from "@/hooks";
import type { Conversation } from "@/services/chat";

type View = "recent" | "full-history" | "chat";

const STORAGE_KEY = "foxio-active-chat";

function getSavedState(): { view: View; conversation: Conversation | null; isNewChat: boolean } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { view: "recent", conversation: null, isNewChat: false };
}

function saveState(view: View, conversation: Conversation | null, isNewChat: boolean) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ view, conversation, isNewChat }));
}

function clearState() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function ChatbotPage() {
  const { conversations, fetchConversations, loading, patchConversation, removeConversation } = useChat();

  const saved = getSavedState();
  const [view, setView] = useState<View>(saved.view);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(saved.conversation);
  const [isNewChat, setIsNewChat] = useState(saved.isNewChat);
  const [totalConversations, setTotalConversations] = useState(0);
  const [localConversations, setLocalConversations] = useState<Conversation[]>([]);

  const refreshRecent = useCallback(() => {
    fetchConversations({ page: 1, page_size: 3 }).then((data) => {
      if (data) {
        setTotalConversations(data.total);
        setLocalConversations(data.items);
      }
    }).catch(() => {});
  }, [fetchConversations]);

  useEffect(() => {
    refreshRecent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync from hook state
  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

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

  const handleSeeMore = useCallback(() => {
    setView("full-history");
    saveState("full-history", null, false);
  }, []);

  const handleBackToRecent = useCallback(() => {
    setView("recent");
    clearState();
    refreshRecent();
  }, [refreshRecent]);

  const handleBackFromChat = useCallback(() => {
    setView("recent");
    setSelectedConversation(null);
    setIsNewChat(false);
    clearState();
    refreshRecent();
  }, [refreshRecent]);

  // --- Conversation actions (optimistic + API) ---
  const handleRename = useCallback(async (id: string, title: string) => {
    setLocalConversations((prev) =>
      prev.map((c) => (c.conversation_id === id ? { ...c, title } : c))
    );
    try {
      await patchConversation(id, { title });
    } catch {
      refreshRecent();
    }
  }, [patchConversation, refreshRecent]);

  const handlePin = useCallback(async (id: string, pinned: boolean) => {
    setLocalConversations((prev) =>
      prev.map((c) => (c.conversation_id === id ? { ...c, is_pinned: pinned } : c))
    );
    try {
      await patchConversation(id, { is_pinned: pinned });
    } catch {
      refreshRecent();
    }
  }, [patchConversation, refreshRecent]);

  const handleArchive = useCallback(async (id: string, archived: boolean) => {
    setLocalConversations((prev) => prev.filter((c) => c.conversation_id !== id));
    try {
      await patchConversation(id, { is_archived: archived });
      refreshRecent();
    } catch {
      refreshRecent();
    }
  }, [patchConversation, refreshRecent]);

  const handleDelete = useCallback(async (id: string) => {
    setLocalConversations((prev) => prev.filter((c) => c.conversation_id !== id));
    setTotalConversations((t) => Math.max(0, t - 1));
    try {
      await removeConversation(id);
    } catch {
      refreshRecent();
    }
  }, [removeConversation, refreshRecent]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {view === "recent" && (
        <>
          <div className="shrink-0 px-3 pt-2 space-y-2">
            <PageTitle name="Chatbot" />
            <ContextLabel />
          </div>
          <div className="flex-1 overflow-hidden">
            <RecentChats
              conversations={localConversations}
              loading={loading}
              onSelect={handleSelect}
              onNewChat={handleNewChat}
              onSeeMore={handleSeeMore}
              onRename={handleRename}
              onPin={handlePin}
              onArchive={handleArchive}
              onDelete={handleDelete}
              total={totalConversations}
            />
          </div>
        </>
      )}

      {view === "full-history" && (
        <>
          <div className="shrink-0 px-3 pt-2 space-y-2">
            <PageTitle name="Chatbot" />
            <ContextLabel />
          </div>
          <div className="flex-1 overflow-hidden">
            <ConversationHistoryFull
              onSelect={handleSelect}
              onBack={handleBackToRecent}
              onRename={handleRename}
              onPin={handlePin}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          </div>
        </>
      )}

      {view === "chat" && (
        <ConversationChat
          conversation={selectedConversation}
          isNewChat={isNewChat}
          onBack={handleBackFromChat}
        />
      )}
    </div>
  );
}
