import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestionChips } from "./SuggestionChips";
import type { ChatMessageData } from "./ChatMessage";
import type { SuggestionChip } from "./SuggestionChips";
import type { Message, Conversation } from "@/services/chat";
import { useChat, usePageContext } from "@/hooks";

interface ConversationChatProps {
  conversation: Conversation | null;
  isNewChat: boolean;
  onBack: () => void;
}

const suggestions: SuggestionChip[] = [
  { id: "1", label: "Summarize this page", icon: <Sparkles className="w-3 h-3" /> },
  { id: "2", label: "What can I do here?", icon: <Zap className="w-3 h-3" /> },
];

function mapApiMessages(messages: Message[]): ChatMessageData[] {
  return messages.map((msg) => ({
    id: msg.message_id,
    role: msg.role === "assistant" ? "ai" : "user",
    content: msg.content,
    timestamp: msg.created_at,
  }));
}

export function ConversationChat({ conversation, isNewChat, onBack }: ConversationChatProps) {
  const { fetchMessages, storeContext, startConversation, send } = useChat();
  const { publicContext } = usePageContext();

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [initializing, setInitializing] = useState(!isNewChat);
  const [sending, setSending] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversation?.conversation_id || null
  );
  const [contextId, setContextId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(conversation?.title || "New Chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const creatingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Only load existing conversation on mount; new chats are lazily initialized on first send
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    if (!isNewChat && conversation) {
      (async () => {
        try {
          const data = await fetchMessages(conversation.conversation_id, { page: 1, page_size: 50 });
          setMessages(mapApiMessages(data.items));
          setActiveConversationId(conversation.conversation_id);
          if (publicContext) {
            const snapshot = await storeContext({
              conversation_id: conversation.conversation_id,
              platform: publicContext.metadata.site,
              page_context: publicContext,
            });
            setContextId(snapshot.context_id);
          }
        } catch {
          // error handled by hook
        } finally {
          setInitializing(false);
        }
      })();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lazily create conversation + context on first message for new chats
  const ensureConversation = useCallback(async (): Promise<{ convId: string; ctxId: string } | null> => {
    if (activeConversationId && contextId) {
      return { convId: activeConversationId, ctxId: contextId };
    }
    if (creatingRef.current) return null;
    creatingRef.current = true;

    try {
      if (!publicContext) return null;

      const conv = await startConversation({
        platform: publicContext.metadata.site,
        source_url: publicContext.url,
        page_title: publicContext.title,
      });
      setActiveConversationId(conv.conversation_id);
      setTitle(conv.title || publicContext.title || "New Chat");

      const snapshot = await storeContext({
        conversation_id: conv.conversation_id,
        platform: publicContext.metadata.site,
        page_context: publicContext,
      });
      setContextId(snapshot.context_id);

      return { convId: conv.conversation_id, ctxId: snapshot.context_id };
    } catch {
      return null;
    } finally {
      creatingRef.current = false;
    }
  }, [activeConversationId, contextId, publicContext, startConversation, storeContext]);

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: ChatMessageData = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setSending(true);

      try {
        const ids = await ensureConversation();
        if (!ids) throw new Error("Could not initialize conversation");

        const response = await send({
          conversation_id: ids.convId,
          context_id: ids.ctxId,
          message: text,
        });

        const aiMsg: ChatMessageData = {
          id: response.message_id,
          role: "ai",
          content: response.answer,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const errMsg: ChatMessageData = {
          id: `err-${Date.now()}`,
          role: "ai",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setSending(false);
      }
    },
    [ensureConversation, send]
  );

  const handleSuggestion = useCallback(
    (chip: SuggestionChip) => {
      handleSend(chip.label);
    },
    [handleSend]
  );

  if (initializing) {
    return (
      <div className="flex flex-col h-full">
        <div className="shrink-0 p-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
        <Loader fullScreen text="Setting up conversation..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-3 pt-2 pb-2 border-b border-border/50 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 rounded-full cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <p className="text-base font-bold text-foreground truncate">
          {title}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 sm:space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {sending && (
          <div className="flex items-start gap-2">
            <Loader size="sm" text="Thinking..." />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer: Suggestions + Input */}
      <div className="shrink-0 border-t border-border/50 p-3 space-y-2">
        <SuggestionChips chips={suggestions} onSelect={handleSuggestion} />
        <ChatInput onSend={handleSend} placeholder="Type your message..." />
      </div>
      </div>
    </div>
  );
}
