"use client";

import { useEffect } from "react";
import { Alert, Box, Button, Card, CardContent, Typography } from "@mui/material";
import { AppIcon } from "@/components/ui/app-icon";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary caught:", error);
  }, [error]);

  const isBackendDown =
    error.message.includes("Backend API") ||
    error.message.includes("fetch failed") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("kết nối") ||
    error.message.includes("connect");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        p: { xs: 2, md: 3 },
      }}
    >
      <Card
        sx={{
          maxWidth: 580,
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AppIcon name="warning" sx={{ color: "error.main", fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "error.main" }}>
              {isBackendDown ? "Cannot Connect to Backend Server" : "An Unexpected Error Occurred"}
            </Typography>
          </Box>

          <Alert severity={isBackendDown ? "warning" : "error"} variant="outlined">
            {error.message || "Failed to connect to the system. Please try again later."}
          </Alert>

          {isBackendDown && (
            <Box sx={{ bgcolor: "action.hover", p: 2, borderRadius: 1.5, fontSize: 13, color: "text.secondary" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
                Troubleshooting steps / Hướng dẫn xử lý:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                <li>Make sure the backend service in <strong>debtflow-api</strong> is running.</li>
                <li>Verify your <code>API_URL</code> environment variable configuration.</li>
              </ul>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
            <Button variant="outlined" color="inherit" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button variant="contained" color="primary" onClick={() => reset()}>
              Try Again
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
