import { useCallback } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemGroup } from "@/components/ui/item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ConversationCard } from "./ConversationCard";
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
  const { items, page, totalPages, loading, error, search, goToPage, query, refresh } =
    useConversationHistory();

  const handleRename = useCallback(async (id: string, title: string) => {
    await onRename(id, title);
    refresh();
  }, [onRename, refresh]);

  const handlePin = useCallback(async (id: string, pinned: boolean) => {
    await onPin(id, pinned);
    refresh();
  }, [onPin, refresh]);

  const handleArchive = useCallback(async (id: string, archived: boolean) => {
    await onArchive(id, archived);
    refresh();
  }, [onArchive, refresh]);

  const handleDelete = useCallback(async (id: string) => {
    await onDelete(id);
    refresh();
  }, [onDelete, refresh]);

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
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder="Search conversations..."
            defaultValue={query}
            onChange={handleSearch} />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        </div>

        {/* List */}
        <ScrollArea className="flex-1 px-3 pb-3 relative">
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

          <ItemGroup>
            {items.map((conv) => (
              <ConversationCard
                key={conv.conversation_id}
                conversation={conv}
                onSelect={onSelect}
                onRename={handleRename}
                onPin={handlePin}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            ))}
          </ItemGroup>
        </ScrollArea>

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
