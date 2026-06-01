import { useState, useCallback, useRef, useEffect } from "react";
import { Pin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/common/Loader";
import { ConversationActions } from "./ConversationActions";
import type { Conversation } from "@/services/chat";

interface ConversationCardProps {
  conversation: Conversation;
  onSelect: (conversation: Conversation) => void;
  onRename: (id: string, title: string) => Promise<void>;
  onPin: (id: string, pinned: boolean) => Promise<void>;
  onArchive: (id: string, archived: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ConversationCard({
  conversation,
  onSelect,
  onRename,
  onPin,
  onArchive,
  onDelete,
}: ConversationCardProps) {
  const [renaming, setRenaming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(conversation.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(conversation.title);
  }, [conversation.title]);

  useEffect(() => {
    if (renaming) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [renaming]);

  const submitRename = useCallback(async () => {
    if (!renaming) return;
    const trimmed = title.trim();
    setRenaming(false);

    if (!trimmed || trimmed === conversation.title) {
      setTitle(conversation.title);
      return;
    }

    setSaving(true);
    try {
      await onRename(conversation.conversation_id, trimmed);
    } catch {
      setTitle(conversation.title);
    } finally {
      setSaving(false);
    }
  }, [renaming, title, conversation, onRename]);

  return (
    <div
      onClick={() => {
        if (!renaming && !saving) onSelect(conversation);
      }}
      className="group w-full text-left p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {renaming ? (
            <Input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitRename();
                }
                if (e.key === "Escape") {
                  setTitle(conversation.title);
                  setRenaming(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-7 text-sm font-medium px-2 py-0"
            />
          ) : saving ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm text-muted-foreground">Saving...</span>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground truncate">
                {conversation.title || "Untitled"}
              </p>
              {conversation.is_pinned && (
                <Pin className="w-3 h-3 text-destructive shrink-0" />
              )}
            </>
          )}
        </div>
        {!renaming && !saving && (
          <ConversationActions
            conversation={conversation}
            onPin={onPin}
            onArchive={onArchive}
            onDelete={onDelete}
            onStartRename={() => setRenaming(true)}
          />
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] text-muted-foreground truncate max-w-[60%]">
          {conversation.platform}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {new Date(conversation.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
