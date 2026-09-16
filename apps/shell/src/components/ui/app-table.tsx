import { Table, TableContainer, type TableProps } from '@mui/material';

type Props = TableProps & { children: React.ReactNode; minWidth?: number; fillAvailable?: boolean };

export function AppTable({ children, fillAvailable = false, minWidth = 860, sx, ...props }: Props) {
  return (
    <TableContainer
      sx={{
        border: 1,
        borderColor: 'divider',
        flex: fillAvailable ? 1 : undefined,
        minHeight: fillAvailable ? 0 : undefined,
        overflow: 'auto',
      }}
    >
      <Table {...props} stickyHeader sx={{ minWidth, ...sx }}>
        {children}
      </Table>
    </TableContainer>
  );
}
