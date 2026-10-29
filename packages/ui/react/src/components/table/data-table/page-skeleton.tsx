'use client';

import { designTokens } from '@packages/ui-tokens';
import { useVisibleSkeletonRows } from './use-visible-skeleton-rows';
import { Box, Skeleton, Typography } from '@mui/material';
import { DataTableContent } from './content';
import { TableLayout } from '../table-layout';
import type { DataTableColumn, ListPageSkeletonProps } from './types';
export type { ListPageSkeletonLayout } from './types';

/** Viewport queries mirror an iframe viewport even when rendered in a wider host. */
export function ListPageSkeleton({ layout, label, frame = false }: ListPageSkeletonProps) {
  const rowHeight = layout.rowHeight ?? designTokens.table.sizes[layout.size ?? 'medium'].rowHeight;
  const { tableRef, rowCount, measured } = useVisibleSkeletonRows(rowHeight);
  const columns: DataTableColumn<never>[] = Object.values(layout.columns).map((column) => ({
    ...column,
    title: (
      <Box
        sx={{
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: column.align === 'right' ? 'flex-end' : 'flex-start',
        }}
      >
        <Skeleton variant="rounded" width={column.key === 'name' ? 44 : 64} height={12} />
      </Box>
    ),
    render: () => null,
  }));
  const view = (
    <Box
      data-list-page-skeleton
      data-layout-ready={measured ? 'true' : undefined}
      aria-busy="true"
      aria-label={label}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        minHeight: 0,
        height: '100%',
        width: '100%',
        maxWidth: layout.maxWidth,
        mx: 'auto',
      }}
    >
      <Box
        data-skeleton-header
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          flexShrink: 0,
          justifyContent: 'space-between',
          '@container page-viewport (min-width: 900px)': {
            flexDirection: 'row',
            alignItems: 'center',
          },
        }}
      >
        <Typography
          component="div"
          sx={{
            fontSize: 22,
            lineHeight: 1.2,
            fontWeight: 800,
            '@container page-viewport (min-width: 900px)': { fontSize: 24 },
          }}
        >
          <Skeleton variant="rounded" width={260} height="1.2em" />
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            '& > *': { flex: '1 1 auto' },
            '@container page-viewport (min-width: 600px)': { '& > *': { flex: '0 0 auto' } },
          }}
        >
          <Skeleton variant="rounded" height={37} width={143} />
          <Skeleton variant="rounded" height={37} width={94} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          flex: 1,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <Box data-skeleton-toolbar sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              '@container page-viewport (min-width: 900px)': { display: 'none' },
            }}
          >
            <Skeleton variant="circular" width={30} height={30} />
          </Box>
          <Box
            sx={{
              display: 'none',
              gap: 1.5,
              alignItems: 'end',
              '@container page-viewport (min-width: 900px)': {
                display: 'grid',
                gridTemplateColumns: layout.toolbarColumns.md ?? layout.toolbarColumns.sm,
              },
              '@container page-viewport (min-width: 1200px)': {
                gridTemplateColumns: layout.toolbarColumns.lg,
              },
              '@container page-viewport (min-width: 1536px)': {
                gridTemplateColumns: layout.toolbarColumns.xl,
              },
            }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} variant="rounded" height={40} />
            ))}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Skeleton variant="rounded" width={96} height={37} />
              <Skeleton variant="rounded" width={98} height={37} />
            </Box>
          </Box>
        </Box>
        <Box
          data-skeleton-table
          ref={tableRef}
          sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}
        >
          <TableLayout
            fillAvailable
            footer={
              <Box
                data-skeleton-pagination
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  minHeight: 58,
                }}
              >
                <Box sx={{ height: 21, display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="rounded" height={16} width={160} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="rounded" height={40} width={130} />
                  <Skeleton variant="rounded" height={32} width={170} />
                </Box>
              </Box>
            }
          >
            <DataTableContent
              columns={columns}
              dataSource={[]}
              emptyMessage=""
              loading
              skeletonRowHeight={rowHeight}
              size={layout.size}
              skeletonRowCount={rowCount}
              tableSx={{ height: 'auto' }}
            />
          </TableLayout>
        </Box>
      </Box>
    </Box>
  );
  return frame ? (
    <Box
      data-page-viewport
      sx={{
        containerType: 'inline-size',
        containerName: 'page-viewport',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          boxSizing: 'border-box',
          p: 1.25,
          '@container page-viewport (min-width: 900px)': { p: 1.5 },
        }}
      >
        {view}
      </Box>
    </Box>
  ) : (
    view
  );
}
