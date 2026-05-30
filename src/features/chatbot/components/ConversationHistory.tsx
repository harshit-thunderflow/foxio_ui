import { useState, useMemo } from "react";
import { SquarePen, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import type { Conversation } from "@/services/chat";

interface ConversationHistoryProps {
  conversations: Conversation[];
  loading: boolean;
  onSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
}

const INITIAL_SHOW_COUNT = 3;

export function ConversationHistory({
  conversations,
  loading,
  onSelect,
  onNewChat,
}: ConversationHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleConversations = useMemo(
    () => (expanded ? conversations : conversations.slice(0, INITIAL_SHOW_COUNT)),
    [conversations, expanded]
  );

  if (loading) {
    return <Loader fullScreen text="Loading conversations..." />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 px-3 py-5">
        <Button onClick={onNewChat} className="w-full gap-2 rounded-xl h-10 cursor-pointer">
          <SquarePen className="w-4 h-4" />
          Start New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-muted-foreground">
            <MessageCircle className="w-8 h-8 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start a new chat to get help from AI</p>
          </div>
        ) : (
          <>
            {/* Centered History heading with separator */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-semibold text-muted-foreground">History</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {visibleConversations.map((conv) => (
              <button
                key={conv.conversation_id}
                onClick={() => onSelect(conv)}
                className="w-full text-left p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors space-y-1 cursor-pointer"
              >
                <p className="text-sm font-medium text-foreground truncate">
                  {conv.title || "Untitled"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground truncate max-w-[60%]">
                    {conv.platform}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}

            {conversations.length > INITIAL_SHOW_COUNT && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full gap-1 text-xs text-muted-foreground cursor-pointer"
              >
                {expanded ? (
                  <>Show Less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>See More ({conversations.length - INITIAL_SHOW_COUNT}) <ChevronDown className="w-3 h-3" /></>
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
