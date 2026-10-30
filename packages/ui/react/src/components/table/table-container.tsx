'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type SxProps, Table, TableContainer, type TableProps, type Theme } from '@mui/material';

import { FixedColumnContext } from './table-cell';
import type { TableScroll } from './types';

type FixedColumnShadows = { left: boolean; right: boolean };

export type DataTableContainerProps = TableProps & {
  children: React.ReactNode;
  bordered?: boolean;
  containerSx?: SxProps<Theme>;
  fillAvailable?: boolean;
  minWidth?: number;
  scroll?: TableScroll;
};

export function DataTableContainer({
  children,
  bordered = true,
  containerSx,
  fillAvailable = false,
  minWidth = 860,
  scroll,
  sx,
  ...props
}: DataTableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadows, setShadows] = useState<FixedColumnShadows>({ left: false, right: false });
  const updateFixedColumnShadows = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const hasOverflow = container.scrollWidth > container.clientWidth + 1;
    const next = {
      left: hasOverflow && container.scrollLeft > 1,
      right:
        hasOverflow && container.scrollLeft + container.clientWidth < container.scrollWidth - 1,
    };

    setShadows((current) =>
      current.left === next.left && current.right === next.right ? current : next,
    );
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(updateFixedColumnShadows);
    observer.observe(container);
    updateFixedColumnShadows();

    return () => observer.disconnect();
  }, [updateFixedColumnShadows]);

  return (
    <FixedColumnContext.Provider value={shadows}>
      <TableContainer
        ref={containerRef}
        onScroll={updateFixedColumnShadows}
        sx={[
          {
            border: bordered ? 1 : undefined,
            borderColor: bordered ? 'divider' : undefined,
            flex: fillAvailable ? 1 : undefined,
            maxHeight: scroll?.y,
            minHeight: fillAvailable ? 0 : undefined,
            overflow: 'auto',
          },
          ...(Array.isArray(containerSx) ? containerSx : [containerSx]),
        ]}
      >
        <Table
          {...props}
          stickyHeader
          sx={[{ minWidth: scroll?.x ?? minWidth }, ...(Array.isArray(sx) ? sx : [sx])]}
        >
          {children}
        </Table>
      </TableContainer>
    </FixedColumnContext.Provider>
  );
}
