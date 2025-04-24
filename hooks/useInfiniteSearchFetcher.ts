import { useEffect, useState, useCallback, useRef } from "react";
import { useDebounce } from "./use-debounce";

type KeyMapper<T> = (item: T) => string;

interface Params<T> {
  initialQuery?: string;
  limit?: number;
  initialValue?: T;
  fetcher: (params: { search: string; page: number; limit: number }) => Promise<T[]>;
  getId: KeyMapper<T>;
}

export const useInfiniteSearchFetcher = <T>({
  initialQuery = "",
  limit = 20,
  initialValue,
  fetcher,
  getId,
}: Params<T>) => {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = async (search: string, pageNumber: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await fetcher({ search, page: pageNumber, limit });
      setItems((prev) => (pageNumber === 1 ? result : [...prev, ...result]));
      setHasMore(result.length === limit);
      setPage(pageNumber + 1);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    } finally {
      setLoading(false);
    }
  };

  const resetAndFetch = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setItems([]);
    fetchPage(debouncedQuery, 1);
  }, [debouncedQuery]);

  useEffect(() => {
    resetAndFetch();
  }, [resetAndFetch]);

  useEffect(() => {
    if (!initialValue || items.find((i) => getId(i) === getId(initialValue))) return;
    setItems((prev) => [...prev, initialValue]);
  }, [initialValue, items]);

  const onScroll = useCallback(() => {
    const el = listRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore && !loading) {
      fetchPage(debouncedQuery, page);
    }
  }, [debouncedQuery, page, hasMore, loading]);

  return {
    items,
    query,
    setQuery,
    loading,
    hasMore,
    listRef,
    onScroll,
  };
};
