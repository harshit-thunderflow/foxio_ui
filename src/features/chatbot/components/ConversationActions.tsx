import { useState, useCallback } from "react";
import { MoreHorizontal, Pencil, Pin, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/services/chat";

interface ConversationActionsProps {
  conversation: Conversation;
  onRename: (id: string, title: string) => Promise<void>;
  onPin: (id: string, pinned: boolean) => Promise<void>;
  onArchive: (id: string, archived: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ConversationActions({
  conversation,
  onRename,
  onPin,
  onArchive,
  onDelete,
}: ConversationActionsProps) {
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const handleRenameSubmit = useCallback(async () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== conversation.title) {
      await onRename(conversation.conversation_id, trimmed);
    }
    setRenaming(false);
  }, [title, conversation, onRename]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleRenameSubmit();
      if (e.key === "Escape") setRenaming(false);
    },
    [handleRenameSubmit]
  );

  if (renaming) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleRenameSubmit}
          autoFocus
          className="h-6 text-xs px-1.5 rounded-md w-28"
        />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            setRenaming(true);
          }}
          className="cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onPin(conversation.conversation_id, !conversation.is_pinned);
          }}
          className="cursor-pointer"
        >
          <Pin className="w-3.5 h-3.5" />
          {conversation.is_pinned ? "Unpin" : "Pin"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onArchive(conversation.conversation_id, !conversation.is_archived);
          }}
          className="cursor-pointer"
        >
          <Archive className="w-3.5 h-3.5" />
          {conversation.is_archived ? "Unarchive" : "Archive"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(conversation.conversation_id);
          }}
          className="cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
