'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DataTable, DataTablePagination, type DataTableColumn } from '@packages/ui-react';
import { Page, PageHeader, MetricGrid } from '@/components/ui/page/page';
import { Card } from '@/components/ui/page/card';
import { tablePageLayouts } from '@/components/tables/page-layouts';
import type { TablePageSkeletonProps } from '@/components/tables/page-layouts.types';

/** Render route geometry using the same table, density and footer as loaded screens. */
export function TablePageSkeleton({ kind = 'debts', label }: TablePageSkeletonProps) {
  const t = useTranslations('PageState');
  const layout = tablePageLayouts[kind];
  const columns: DataTableColumn<never>[] = layout.columns.map((column) => ({
    ...column,
    title: (
      <Box sx={{ height: 24, display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="rounded" width={64} height={12} />
      </Box>
    ),
    render: () => null,
  }));
  const actions = (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {Array.from({ length: layout.actions }, (_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          width={index === 0 && kind === 'debts' ? 160 : 96}
          height={37}
        />
      ))}
    </Box>
  );
  return (
    <Box
      aria-busy="true"
      aria-label={label ?? t('loading')}
      data-table-page-skeleton={kind}
      sx={{ height: '100%', minHeight: 0, p: kind === 'payments' ? 1.5 : 0 }}
    >
      <Page fillAvailable>
        {kind === 'payments' ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography component="div" sx={{ fontSize: 24, lineHeight: 1.2 }}>
                <Skeleton width={240} />
              </Typography>
              <Typography component="div" sx={{ mt: '6px' }}>
                <Skeleton width={340} />
              </Typography>
            </Box>
            {actions}
          </Box>
        ) : (
          <PageHeader
            title={<Skeleton variant="rounded" width={250} height="1.2em" />}
            description={<Skeleton variant="rounded" width={340} height="1.55em" />}
            actions={actions}
          />
        )}
        {layout.metrics ? (
          <MetricGrid columns={5}>
            {Array.from({ length: 5 }, (_, index) => (
              <Card key={index}>
                <Box sx={{ display: 'grid', gap: 1, minHeight: 132 }}>
                  <Skeleton width="65%" height={24} />
                  <Skeleton width="80%" height={36} />
                  <Skeleton width="40%" height={20} />
                </Box>
              </Card>
            ))}
          </MetricGrid>
        ) : null}
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0, mb: kind === 'debts' ? 2.5 : 0 }}>
          <DataTable
            columns={columns}
            dataSource={[]}
            emptyMessage=""
            loading
            size="small"
            scroll={{ x: kind === 'debts' ? 1260 : kind === 'payments' ? 1140 : 1150 }}
            tableSx={{ tableLayout: 'fixed' }}
            title={kind === 'aging' ? <Skeleton width={240} height={26} /> : undefined}
            toolbar={
              layout.filters ? (
                <Box sx={{ py: 2 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Skeleton width={300} height={26} />
                    <Skeleton variant="rounded" width={150} height={31} />
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      mt: 2,
                      gap: 1.25,
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'minmax(220px, 2fr) repeat(2, minmax(160px, 1fr)) auto auto',
                      },
                    }}
                  >
                    {[220, 160, 160, 60, 60].map((width, index) => (
                      <Skeleton
                        key={index}
                        variant="rounded"
                        sx={{ width: index > 2 ? width : '100%' }}
                        height={40}
                      />
                    ))}
                  </Box>
                </Box>
              ) : undefined
            }
            pagination={
              <DataTablePagination loading summary={null}>
                {null}
              </DataTablePagination>
            }
          />
        </Box>
      </Page>
    </Box>
  );
}
