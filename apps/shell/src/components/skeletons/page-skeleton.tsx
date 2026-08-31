import { Box, Paper } from "@mui/material";
import { AppSkeleton } from "@/components/ui/skeleton";

function PageHeadingSkeleton({ actions = true }: { actions?: boolean }) {
  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 2, justifyContent: "space-between" }}>
      <AppSkeleton height={32} sx={{ width: { xs: 220, sm: 340 } }} />
      {actions ? <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}><AppSkeleton height={38} width={126} /><AppSkeleton height={38} width={104} /></Box> : null}
    </Box>
  );
}

function SkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <Box sx={{ display: "grid" }}>
      {Array.from({ length: count }, (_, row) => (
        <Box key={row} sx={{ alignItems: "center", borderTop: "1px solid", borderColor: "divider", display: "grid", gap: 2, gridTemplateColumns: "1fr 1.7fr 1fr 1fr 1.2fr", px: 2, py: 1.5 }}>
          {Array.from({ length: 5 }, (_, column) => <AppSkeleton height={16} key={column} width={`${[78, 64, 86, 56][(row + column) % 4]}%`} />)}
        </Box>
      ))}
    </Box>
  );
}

export function TablePageSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Đang tải dữ liệu" sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: { md: "100%" }, minHeight: 0 }}>
      <PageHeadingSkeleton />
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px", display: "flex", flex: 1, flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "2fr repeat(4, minmax(120px, 1fr))" }, p: 1.5 }}>
          {Array.from({ length: 5 }, (_, index) => <AppSkeleton height={40} key={index} />)}
        </Box>
        <Box sx={{ bgcolor: "action.hover", borderTop: "1px solid", borderColor: "divider", display: "grid", gap: 2, gridTemplateColumns: "1fr 1.7fr 1fr 1fr 1.2fr", px: 2, py: 1.5 }}>
          {Array.from({ length: 5 }, (_, index) => <AppSkeleton height={13} key={index} width="55%" />)}
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}><SkeletonRows /></Box>
        <Box sx={{ alignItems: "center", bgcolor: "background.default", borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", px: 2, py: 1.25 }}>
          <AppSkeleton height={16} width={150} />
          <AppSkeleton height={32} width={210} />
        </Box>
      </Paper>
    </Box>
  );
}

export function DashboardPageSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Đang tải dashboard" sx={{ display: "grid", gap: 2 }}>
      <PageHeadingSkeleton />
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" } }}>
        {Array.from({ length: 4 }, (_, index) => <AppSkeleton height={112} key={index} />)}
      </Box>
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px", overflow: "hidden" }}><SkeletonRows count={6} /></Paper>
    </Box>
  );
}

export function DetailPageSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Đang tải chi tiết" sx={{ display: "grid", gap: 2 }}>
      <PageHeadingSkeleton />
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", xl: "360px minmax(0, 1fr)" } }}>
        <AppSkeleton height={280} />
        <AppSkeleton height={420} />
      </Box>
    </Box>
  );
}

export function FormPageSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Đang tải biểu mẫu" sx={{ display: "grid", gap: 2 }}>
      <PageHeadingSkeleton />
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", xl: "repeat(2, 1fr)" } }}>
        <AppSkeleton height={360} />
        <AppSkeleton height={360} />
      </Box>
    </Box>
  );
}
