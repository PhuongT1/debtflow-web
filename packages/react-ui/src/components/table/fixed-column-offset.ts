import type { FixedTableSide } from './types';

export function getFixedColumnOffset(
  columns: Array<{ fixed?: FixedTableSide; width?: number | string }>,
  columnIndex: number,
  fixed?: FixedTableSide,
) {
  if (!fixed) return undefined;
  const adjacent =
    fixed === 'left' ? columns.slice(0, columnIndex) : columns.slice(columnIndex + 1);
  const widths = adjacent
    .filter((column) => column.fixed === fixed && column.width != null)
    .map((column) => (typeof column.width === 'number' ? `${column.width}px` : column.width));
  return widths.length ? `calc(${widths.join(' + ')})` : 0;
}
