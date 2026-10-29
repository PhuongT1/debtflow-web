import { useLayoutEffect, useRef, useState } from 'react';

/** Size the placeholder from the visible body, independent of API page size. */
export function useVisibleSkeletonRows(rowHeight: number) {
  const tableRef = useRef<HTMLDivElement>(null);
  // Cover the viewport during SSR; measure visible rows before the hydrated paint.
  const [rowCount, setRowCount] = useState(20);
  const [measured, setMeasured] = useState(false);
  useLayoutEffect(() => {
    const target = tableRef.current;
    if (!target) return;
    const measure = () => {
      const headerHeight = target.querySelector('thead')?.getBoundingClientRect().height ?? 0;
      const footerHeight =
        target.querySelector('[data-skeleton-pagination]')?.parentElement?.getBoundingClientRect()
          .height ?? 0;
      const viewport = target.closest('[data-page-viewport]');
      const compact = (viewport?.clientWidth ?? target.clientWidth) < 900;
      setMeasured(true);
      setRowCount(
        Math.max(
          1,
          Math.ceil(
            (target.clientHeight - headerHeight - (compact ? 0 : footerHeight)) / rowHeight,
          ) + (compact ? 1 : 0),
        ),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    return () => observer.disconnect();
  }, [rowHeight]);
  return { tableRef, rowCount, measured };
}
