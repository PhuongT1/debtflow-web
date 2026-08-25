import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AppIcon } from "@/components/ui/app-icon";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableRowsSkeleton } from "@/components/skeletons/data-table-skeleton";

export type DataTableColumn<Row> = {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  sticky?: boolean;
  width?: number | string;
  skeleton?: DataTableSkeletonSpec;
  render: (row: Row) => React.ReactNode;
};

export type DataTableSkeletonSpec = {
  direction?: "row" | "column";
  items: Array<{
    height?: number;
    variant?: "circular" | "rounded";
    width: number | string;
  }>;
};

type DataTableProps<Row> = {
  title?: string;
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  emptyMessage?: string;
  page: number;
  pageSize: number;
  total: number;
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
  fillHeight?: boolean;
  loading?: boolean;
  pagination?: boolean;
  toolbar?: React.ReactNode;
};

export function DataTable<Row>({
  title,
  columns,
  rows,
  emptyMessage = "Không có dữ liệu",
  page,
  pageSize,
  total,
  hrefForPage,
  hrefForPageSize,
  fillHeight = false,
  loading = false,
  pagination = true,
  toolbar,
}: DataTableProps<Row>) {
  const showTableState = loading || rows.length === 0;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        boxShadow: "none",
        display: "flex",
        flex: fillHeight ? { xs: "0 0 auto", md: "1 1 0" } : undefined,
        flexDirection: "column",
        minHeight: fillHeight ? { md: 0 } : undefined,
        overflow: "hidden",
      }}
    >
      {title ? (
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", flexShrink: 0, px: { xs: 2, sm: 2.5 }, py: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 800 }}>{title}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.25 }}>{total.toLocaleString("vi-VN")} bản ghi</Typography>
          </Box>
        </Box>
      ) : null}
      {toolbar ? (
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", flexShrink: 0, p: { xs: 1.25, sm: 1.5 } }}>
          {toolbar}
        </Box>
      ) : null}
      <TableContainer
        sx={{
          flex: fillHeight ? { xs: "0 0 auto", md: "1 1 0" } : undefined,
          maxWidth: "100%",
          minHeight: fillHeight ? { md: 0 } : undefined,
          overflow: "auto",
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{ height: fillHeight && showTableState ? "100%" : undefined, minWidth: 860 }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={{
                    borderRightColor: column.sticky ? "divider" : undefined,
                    borderRightStyle: column.sticky ? "solid" : undefined,
                    borderRightWidth: column.sticky ? 1 : undefined,
                    left: column.sticky ? 0 : undefined,
                    minWidth: column.width,
                    position: column.sticky ? "sticky" : undefined,
                    whiteSpace: "nowrap",
                    width: column.width,
                    zIndex: column.sticky ? 4 : undefined,
                  }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <DataTableRowsSkeleton columns={columns} rowCount={Math.min(10, Math.max(5, pageSize))} />
            ) : rows.length === 0 ? (
              <TableRow sx={{ height: fillHeight ? "100%" : undefined }}>
                <TableCell colSpan={columns.length} sx={{ borderBottom: 0 }}>
                  <Box sx={{ alignContent: "center", color: "text.secondary", display: "grid", justifyItems: "center", minHeight: fillHeight ? 0 : 200, textAlign: "center" }}>
                    <Box sx={{ bgcolor: "action.hover", borderRadius: "50%", display: "grid", height: 48, mb: 1.5, placeItems: "center", width: 48 }}>
                      <AppIcon name="list" />
                    </Box>
                    <Typography sx={{ fontWeight: 750 }}>{emptyMessage}</Typography>
                    <Typography sx={{ mt: 0.5 }} variant="body2">Thử đổi bộ lọc hoặc tạo dữ liệu mới.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow hover key={rowIndex} sx={{ "&:hover td": { bgcolor: "action.hover" }, "&:last-child td": { borderBottom: 0 } }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{
                        bgcolor: column.sticky ? "background.paper" : undefined,
                        borderRightColor: column.sticky ? "divider" : undefined,
                        borderRightStyle: column.sticky ? "solid" : undefined,
                        borderRightWidth: column.sticky ? 1 : undefined,
                        color: "text.primary",
                        fontWeight: 600,
                        left: column.sticky ? 0 : undefined,
                        minWidth: column.width,
                        position: column.sticky ? "sticky" : undefined,
                        width: column.width,
                        zIndex: column.sticky ? 1 : undefined,
                      }}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination ? (
        <DataTablePagination
          hrefForPage={hrefForPage}
          hrefForPageSize={hrefForPageSize}
          page={page}
          pageSize={pageSize}
          total={total}
          loading={loading}
        />
      ) : null}
    </Paper>
  );
}
