import Link from "next/link";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { AppIcon } from "@/components/ui/app-icon";
import { PageSizeSelect } from "@/components/ui/page-size-select";
import { AppSkeleton } from "@/components/ui/skeleton";

export function DataTablePagination({
  page,
  pageSize,
  total,
  hrefForPage,
  hrefForPageSize,
  loading = false,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
  loading?: boolean;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const pageSizeOptions = hrefForPageSize
    ? [10, 20, 30, 50, 100].map((size) => ({ size, href: hrefForPageSize(size) }))
    : [];

  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexShrink: 0,
        flexWrap: "wrap",
        gap: 1,
        justifyContent: "space-between",
        px: { xs: 1.5, sm: 2 },
        py: 1,
      }}
    >
      {loading ? (
        <>
          <AppSkeleton height={18} width={150} />
          <AppSkeleton height={32} width={220} />
        </>
      ) : (
        <>
      <Typography color="text.secondary" variant="body2">
        Hiển thị {from}-{to} / {total} dòng
      </Typography>
      <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
          <PageSizeSelect options={pageSizeOptions} pageSize={pageSize} />
        </Box>
        <Tooltip title="Trang trước">
          <span>
            <IconButton aria-label="Trang trước" component={Link} disabled={page <= 1} href={hrefForPage(Math.max(1, page - 1))} size="small">
              <AppIcon fontSize="small" name="chevronLeft" />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body2">
          Trang {page}/{totalPages}
        </Typography>
        <Tooltip title="Trang sau">
          <span>
            <IconButton aria-label="Trang sau" component={Link} disabled={page >= totalPages} href={hrefForPage(Math.min(totalPages, page + 1))} size="small">
              <AppIcon fontSize="small" name="chevronRight" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
        </>
      )}
    </Box>
  );
}
