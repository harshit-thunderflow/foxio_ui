import { useMemo } from "react";
import { SquarePen, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { ConversationCard } from "./ConversationCard";
import type { Conversation } from "@/services/chat";

interface RecentChatsProps {
  conversations: Conversation[];
  loading: boolean;
  onSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
  onSeeMore: () => void;
  onRename: (id: string, title: string) => Promise<void>;
  onPin: (id: string, pinned: boolean) => Promise<void>;
  onArchive: (id: string, archived: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  total: number;
}

const SHOW_COUNT = 3;

export function RecentChats({
  conversations,
  loading,
  onSelect,
  onNewChat,
  onSeeMore,
  onRename,
  onPin,
  onArchive,
  onDelete,
  total,
}: RecentChatsProps) {
  const visible = useMemo(() => conversations.slice(0, SHOW_COUNT), [conversations]);

  if (loading) {
    return <Loader fullScreen text="Loading conversations..." />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-full overflow-hidden">
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
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-semibold text-muted-foreground">Recent</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {visible.map((conv) => (
                <ConversationCard
                  key={conv.conversation_id}
                  conversation={conv}
                  onSelect={onSelect}
                  onRename={onRename}
                  onPin={onPin}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
              ))}

              {total > SHOW_COUNT && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSeeMore}
                  className="w-full gap-1 text-xs text-muted-foreground cursor-pointer"
                >
                  See More ({total - SHOW_COUNT}) <ChevronRight className="w-3 h-3" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
