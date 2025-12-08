/**
 * Pagination hook
 */

import { useState, useMemo } from 'react';
import type { PaginationParams } from '@/types';
import { PAGINATION } from '@/utils/constants';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  totalItems: number;
}

interface UsePaginationReturn extends PaginationParams {
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setLimit: (limit: number) => void;
  reset: () => void;
}

export function usePagination({
  initialPage = PAGINATION.DEFAULT_PAGE,
  initialLimit = PAGINATION.DEFAULT_LIMIT,
  totalItems,
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / limit) || 1;
  }, [totalItems, limit]);

  const offset = useMemo(() => {
    return (page - 1) * limit;
  }, [page, limit]);

  const hasNextPage = useMemo(() => {
    return page < totalPages;
  }, [page, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return page > 1;
  }, [page]);

  const goToPage = (newPage: number) => {
    const pageNumber = Math.max(1, Math.min(newPage, totalPages));
    setPage(pageNumber);
  };

  const nextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  };

  const setLimit = (newLimit: number) => {
    setLimitState(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const reset = () => {
    setPage(initialPage);
    setLimitState(initialLimit);
  };

  return {
    page,
    limit,
    offset,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
    reset,
  };
}
