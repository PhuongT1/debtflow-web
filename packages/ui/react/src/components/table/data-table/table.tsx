import { Box, Typography } from '@mui/material';
import { DataTableContent } from './content';
import { TableLayout } from '../table-layout';
import type { DataTableProps } from './types';

/** Shared /debts surface: header/filters outside the border, scrolling body and fixed footer. */
export function DataTable<Row>({
  title,
  description,
  toolbar,
  footer,
  pagination,
  fillHeight = true,
  ...content
}: DataTableProps<Row>) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        flex: fillHeight ? '1 1 0' : undefined,
        minHeight: fillHeight ? 0 : undefined,
        minWidth: 0,
      }}
    >
      {title || toolbar ? (
        <Box sx={{ flexShrink: 0 }}>
          {title ? (
            <Box
              sx={{
                alignItems: 'baseline',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.25,
                mb: toolbar ? 1.5 : 0,
              }}
            >
              <Typography sx={{ fontSize: 17, fontWeight: 800 }}>{title}</Typography>
              {description ? (
                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
          ) : null}
          {toolbar}
        </Box>
      ) : null}
      <TableLayout fillAvailable={fillHeight} footer={pagination}>
        <DataTableContent {...content} fillHeight={fillHeight} />
        {footer ? <Box sx={{ flexShrink: 0, px: 2.5, py: 1.5 }}>{footer}</Box> : null}
      </TableLayout>
    </Box>
  );
}
