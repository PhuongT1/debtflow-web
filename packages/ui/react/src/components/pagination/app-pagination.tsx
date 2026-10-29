'use client';

import { Pagination } from '@mui/material';

export type AppPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

/** Shared, accessible page navigation for paginated data tables. */
export function AppPagination({
  page,
  pageSize,
  total,
  onPageChange,
  disabled = false,
}: AppPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Pagination
      boundaryCount={1}
      color="standard"
      count={totalPages}
      disabled={disabled}
      page={Math.min(Math.max(1, page), totalPages)}
      onChange={(_, nextPage) => onPageChange(nextPage)}
      shape="circular"
      siblingCount={1}
      size="medium"
      sx={{
        flexShrink: 0,
        '& .MuiPagination-ul': { flexWrap: 'nowrap' },
        '& .MuiPaginationItem-root': { flexShrink: 0 },
      }}
    />
  );
}
