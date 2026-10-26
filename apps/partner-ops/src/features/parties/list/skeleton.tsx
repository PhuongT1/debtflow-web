import { useTranslations } from 'next-intl';
import { Box } from '@mui/material';
import { DataTable, type DataTableColumn } from '@/components/tables';
import { Page, PageHeader } from '@/components/ui/page/page';
import { AppSkeleton } from '@/components/ui/skeleton';
import { getPartyTableColumns } from './table-columns';

export function PartyListSkeleton() {
  const t = useTranslations('Parties');
  const headers = {
    name: t('name'),
    type: t('type'),
    sale: t('sale'),
    contact: t('contact'),
    receivable: t('receivable'),
    payable: t('payable'),
    actions: t('actions'),
  };
  const columns: Array<DataTableColumn<never>> = Object.values(getPartyTableColumns(headers)).map(
    (column) => ({ ...column, render: () => null }),
  );
  const toolbar = (
    <>
      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
        <AppSkeleton height={32} variant="circular" width={32} />
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: { xs: 'none', md: 'grid' },
          gap: 1.5,
          gridTemplateColumns: '2fr repeat(4, minmax(140px, 1fr)) auto auto',
        }}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <AppSkeleton height={32} key={index} />
        ))}
        <AppSkeleton height={32} width={88} />
        <AppSkeleton height={32} width={112} />
      </Box>
    </>
  );

  return (
    <Page contentWidth="wide" fillAvailable>
      <PageHeader
        compact
        title={t('title')}
        actions={
          <>
            <AppSkeleton height={38} width={148} />
            <AppSkeleton height={38} width={118} />
          </>
        }
      />
      <DataTable
        columns={columns}
        fillHeight
        hrefForPage={() => '#'}
        loading
        page={1}
        pageSize={10}
        rows={[]}
        toolbar={toolbar}
        total={0}
      />
    </Page>
  );
}
