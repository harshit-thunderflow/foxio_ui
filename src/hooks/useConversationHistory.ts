import { useState, useCallback, useEffect, useRef } from "react";
import { getConversations } from "@/services/chat";
import type { Conversation, PaginatedConversationsResponse } from "@/services/chat";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

export function useConversationHistory() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(async (p: number, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedConversationsResponse = await getConversations({
        page: p,
        page_size: PAGE_SIZE,
        q: q || undefined,
      });
      setItems(data.items);
      setPage(data.page);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  const search = useCallback(
    (q: string) => {
      setQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setPage(1);
        fetchPage(1, q);
      }, DEBOUNCE_MS);
    },
    [fetchPage]
  );

  const goToPage = useCallback(
    (p: number) => {
      if (p < 1 || p > totalPages) return;
      setPage(p);
      fetchPage(p, query);
    },
    [fetchPage, query, totalPages]
  );

  // Initial fetch
  useEffect(() => {
    fetchPage(1, "");
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchPage]);

  return { items, page, totalPages, total, query, loading, error, search, goToPage };
}
