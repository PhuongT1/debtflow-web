"use client";

import type { FormEventHandler } from "react";
import { useId, useState } from "react";
import { Box, Collapse, IconButton, Tooltip, type Breakpoint } from "@mui/material";
import { AppIcon } from "@/components/ui/app-icon";

type ResponsiveColumns = Partial<Record<Breakpoint, string>>;

export function DataTableToolbar({
  children,
  columns = {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  },
  onSubmit,
}: {
  children: React.ReactNode;
  columns?: ResponsiveColumns;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}) {
  const filterContentId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => {
        setMobileOpen(false);
        onSubmit?.(event);
      }}
    >
      <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
        <Tooltip title={mobileOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}>
          <IconButton
            aria-controls={filterContentId}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            onClick={() => setMobileOpen((current) => !current)}
            size="small"
            type="button"
          >
            <AppIcon fontSize="small" name="filter" />
          </IconButton>
        </Tooltip>
      </Box>
      <Collapse
        in={mobileOpen}
        sx={{
          display: { md: "contents" },
          height: { md: "auto !important" },
          overflow: { md: "visible !important" },
          visibility: { md: "visible !important" },
          "& .MuiCollapse-wrapper": { display: { md: "contents" } },
          "& .MuiCollapse-wrapperInner": { display: { md: "contents" } },
        }}
        timeout="auto"
      >
        <Box
          id={filterContentId}
          sx={{
            alignItems: "end",
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: columns,
            mt: { xs: 1.25, md: 0 },
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}
