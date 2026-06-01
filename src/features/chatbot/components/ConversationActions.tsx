import { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Pencil, Pin, Archive, Trash2 } from "lucide-react";
import type { Conversation } from "@/services/chat";

interface ConversationActionsProps {
  conversation: Conversation;
  onPin: (id: string, pinned: boolean) => Promise<void>;
  onArchive: (id: string, archived: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onStartRename: () => void;
}

export function ConversationActions({
  conversation,
  onPin,
  onArchive,
  onDelete,
  onStartRename,
}: ConversationActionsProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      // Use composedPath to handle Shadow DOM event retargeting
      const path = e.composedPath();
      if (!path.includes(containerRef.current)) {
        setOpen(false);
      }
    }

    const id = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 rounded-md hover:bg-accent"
      >
        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[130px] rounded-lg border border-border bg-popover p-1 shadow-md">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onStartRename();
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-popover-foreground rounded-md hover:bg-accent transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Rename
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onPin(conversation.conversation_id, !conversation.is_pinned);
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-popover-foreground rounded-md hover:bg-accent transition-colors cursor-pointer"
          >
            <Pin className="w-3.5 h-3.5" />
            {conversation.is_pinned ? "Unpin" : "Pin"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onArchive(conversation.conversation_id, !conversation.is_archived);
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-popover-foreground rounded-md hover:bg-accent transition-colors cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5" />
            {conversation.is_archived ? "Unarchive" : "Archive"}
          </button>

          <div className="my-1 h-px bg-border" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(conversation.conversation_id);
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-destructive rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
