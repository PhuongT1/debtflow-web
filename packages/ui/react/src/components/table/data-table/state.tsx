import { Box, TableRow, Typography } from '@mui/material';

import { DataTableCell } from '../table-cell';

import type { DataTableStateProps } from './state.types';

export function DataTableState({ columns, fillHeight, message, hint, icon }: DataTableStateProps) {
  return (
    <TableRow sx={{ height: fillHeight ? '100%' : undefined }}>
      <DataTableCell colSpan={columns} sx={{ borderBottom: 0, p: 0, verticalAlign: 'middle' }}>
        <Box
          data-table-state
          role="status"
          sx={{
            color: 'text.secondary',
            position: 'sticky',
            left: 0,
            width: '100cqw',
            maxWidth: '100%',
            boxSizing: 'border-box',
            px: 2,
            display: 'grid',
            justifyItems: 'center',
            alignContent: 'center',
            minHeight: 200,
            py: 4,
            textAlign: 'center',
          }}
        >
          {icon ? (
            <Box
              sx={{
                bgcolor: 'action.hover',
                borderRadius: '50%',
                display: 'grid',
                height: 48,
                mb: 1.5,
                placeItems: 'center',
                width: 48,
              }}
            >
              {icon}
            </Box>
          ) : null}
          <Typography sx={{ fontWeight: 750 }}>{message}</Typography>
          {hint ? (
            <Typography sx={{ mt: 0.5 }} variant="body2">
              {hint}
            </Typography>
          ) : null}
        </Box>
      </DataTableCell>
    </TableRow>
  );
}
