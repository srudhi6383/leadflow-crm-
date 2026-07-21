import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const updatePaginationMeta = (meta = {}) => {
    if (meta.currentPage) setPage(meta.currentPage);
    if (meta.totalPages !== undefined) setTotalPages(meta.totalPages);
    if (meta.totalItems !== undefined) setTotalItems(meta.totalItems);
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
    nextPage,
    prevPage,
    updatePaginationMeta,
  };
};
