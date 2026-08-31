import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner Operations | Debt Flow",
  description:
    "Micro frontend quản lý khách hàng và nhà cung cấp trong hệ thống Debt Flow.",
};
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

const capabilities = [
  "Danh mục khách hàng và nhà cung cấp",
  "Tìm kiếm, lọc và phân trang dữ liệu đối tác",
  "Quản lý hạn mức, liên hệ và người phụ trách",
];

export default function PartnerOpsLandingPage() {
  return (
    <Box
      component="section"
      sx={{
        display: "grid",
        flex: "1 1 auto",
        minHeight: 0,
        placeItems: "center",
        px: { xs: 2, md: 4 },
        py: { xs: 5, md: 8 },
      }}
    >
      <Box sx={{ maxWidth: 760, width: "100%" }}>
        <Chip color="primary" label="Debt Flow · Partner Operations" size="small" />
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 34, md: 52 },
            fontWeight: 850,
            letterSpacing: -1.5,
            lineHeight: 1.08,
            mt: 2.25,
          }}
        >
          Quản lý đối tác, độc lập và tập trung.
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            fontSize: { xs: 16, md: 19 },
            lineHeight: 1.7,
            maxWidth: 680,
            mt: 2.5,
          }}
        >
          Partner Ops là micro frontend phụ trách khách hàng và nhà cung cấp trong hệ thống Debt Flow. Đăng nhập và phiên làm việc được Platform quản lý tập trung.
        </Typography>
        <Stack component="ul" spacing={1.25} sx={{ color: "text.secondary", mt: 3.5, pl: 2.5 }}>
          {capabilities.map((capability) => (
            <Typography component="li" key={capability}>
              {capability}
            </Typography>
          ))}
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4 }}>
          <Button component={Link} href="/parties" size="large" variant="contained">
            Mở workspace
          </Button>
          <Button component="a" href="/api/health" size="large" variant="outlined">
            Kiểm tra trạng thái ứng dụng
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
