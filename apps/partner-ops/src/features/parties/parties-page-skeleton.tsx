import { Box } from '@mui/material';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Page, PageHeader } from '@/components/ui/page';
import { AppSkeleton } from '@/components/ui/skeleton';
import { partyTableColumns } from '@/features/parties/table-config';

const columns: Array<DataTableColumn<never>> = Object.values(partyTableColumns).map((column) => ({
  ...column,
  render: () => null,
}));

export function PartiesPageSkeleton() {
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
        title="Khách hàng / Nhà cung cấp"
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
