import { Box, TableCell, TableRow } from "@mui/material";
import { AppSkeleton } from "@/components/ui/skeleton";
import type { DataTableSkeletonSpec } from "@/components/ui/data-table";

type SkeletonColumn = {
  key: string;
  align?: "left" | "right" | "center";
  sticky?: boolean;
  width?: number | string;
  skeleton?: DataTableSkeletonSpec;
};

const widths = [72, 88, 64, 76, 58];

export function DataTableRowsSkeleton({ columns, rowCount = 8 }: { columns: SkeletonColumn[]; rowCount?: number }) {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <TableRow aria-hidden key={rowIndex} sx={{ height: 68 }}>
      {columns.map((column, columnIndex) => (
        <TableCell
          align={column.align}
          key={column.key}
          sx={{
            bgcolor: column.sticky ? "background.paper" : undefined,
            borderRight: column.sticky ? "1px solid" : undefined,
            borderRightColor: column.sticky ? "divider" : undefined,
            left: column.sticky ? 0 : undefined,
            minWidth: column.width,
            position: column.sticky ? "sticky" : undefined,
            width: column.width,
            zIndex: column.sticky ? 1 : undefined,
          }}
        >
          <Box
            sx={{
              alignItems: column.skeleton?.direction === "row" ? "center" : column.align === "right" ? "flex-end" : column.align === "center" ? "center" : "flex-start",
              display: "flex",
              flexDirection: column.skeleton?.direction ?? "column",
              gap: column.skeleton?.direction === "row" ? 1 : 0.75,
              justifyContent: column.align === "right" ? "flex-end" : column.align === "center" ? "center" : "flex-start",
            }}
          >
            {(column.skeleton?.items ?? [{ height: 14, width: `${widths[(rowIndex + columnIndex) % widths.length]}%` }]).map((item, itemIndex) => (
              <AppSkeleton
                height={item.height ?? 14}
                key={itemIndex}
                variant={item.variant ?? "rounded"}
                width={item.width}
              />
            ))}
          </Box>
        </TableCell>
      ))}
    </TableRow>
  ));
}
