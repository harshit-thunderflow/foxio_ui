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
  const [initializing, setInitializing] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversation?.conversation_id || null
  );
  const [contextId, setContextId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function init() {
      if (!isNewChat && conversation) {
        try {
          const msgs = await fetchMessages(conversation.conversation_id);
          setMessages(mapApiMessages(msgs));
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
        }
      } else {
        try {
          if (!publicContext) {
            setInitializing(false);
            return;
          }

          const conv = await startConversation({
            platform: publicContext.metadata.site,
            source_url: publicContext.url,
            page_title: publicContext.title,
          });

          setActiveConversationId(conv.conversation_id);

          const snapshot = await storeContext({
            conversation_id: conv.conversation_id,
            platform: publicContext.metadata.site,
            page_context: publicContext,
          });

          setContextId(snapshot.context_id);
          const msgs = await fetchMessages(conv.conversation_id);
          setMessages(mapApiMessages(msgs));
        } catch {
          // error handled by hook
        }
      }

      setInitializing(false);
    }

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeConversationId || !contextId) return;

      const userMsg: ChatMessageData = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setSending(true);

      try {
        const response = await send({
          conversation_id: activeConversationId,
          context_id: contextId,
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
    [activeConversationId, contextId, send]
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
      {/* Header: back button on top, title below */}
      <div className="shrink-0 px-3 pt-2 pb-2 border-b border-border/50 space-y-1">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <p className="text-base font-bold text-foreground truncate px-1">
          {conversation?.title || "New Chat"}
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
