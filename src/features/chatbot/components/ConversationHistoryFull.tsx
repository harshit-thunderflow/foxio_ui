import { useCallback } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/common/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ConversationActions } from "./ConversationActions";
import { useConversationHistory } from "@/hooks/useConversationHistory";
import type { Conversation } from "@/services/chat";

interface ConversationHistoryFullProps {
  onSelect: (conversation: Conversation) => void;
  onBack: () => void;
  onRename: (id: string, title: string) => Promise<void>;
  onPin: (id: string, pinned: boolean) => Promise<void>;
  onArchive: (id: string, archived: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ConversationHistoryFull({ onSelect, onBack, onRename, onPin, onArchive, onDelete }: ConversationHistoryFullProps) {
  const { items, page, totalPages, loading, error, search, goToPage, query } =
    useConversationHistory();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      search(e.target.value);
    },
    [search]
  );

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (start > 2) pages.push(<PaginationItem key="e1"><PaginationEllipsis /></PaginationItem>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === page} onClick={() => goToPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<PaginationItem key="e2"><PaginationEllipsis /></PaginationItem>);
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => goToPage(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="shrink-0 px-3 py-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-sm font-semibold text-foreground">All Conversations</h2>
        </div>

        {/* Search */}
        <div className="shrink-0 px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              defaultValue={query}
              onChange={handleSearch}
              className="pl-9 h-9 rounded-xl"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl">
              <Loader text="Loading..." />
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive text-center py-4">{error}</p>
          )}

          {!loading && items.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              No conversations found.
            </p>
          )}

          {items.map((conv) => (
            <div
              key={conv.conversation_id}
              onClick={() => onSelect(conv)}
              className="group w-full text-left p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground truncate flex-1">
                  {conv.title || "Untitled"}
                </p>
                <ConversationActions
                  conversation={conv}
                  onRename={onRename}
                  onPin={onPin}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-muted-foreground truncate max-w-[60%]">
                  {conv.platform}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(conv.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="shrink-0 px-3 py-2 border-t border-border">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => goToPage(page - 1)} disabled={page <= 1} />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                  <PaginationNext onClick={() => goToPage(page + 1)} disabled={page >= totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
