"use client";

import Link from "next/link";
import { Box } from "@mui/material";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";

export function FilterActions({ resetHref, onReset }: { resetHref: string; onReset?: () => void }) {
  const resetButton = onReset ? (
    <Button onClick={onReset} startIcon={<AppIcon fontSize="small" name="refresh" />} type="button" variant="secondary">
      Xóa lọc
    </Button>
  ) : (
    <Button
      component={Link}
      href={resetHref}
      onClick={(event) => event.currentTarget.closest("form")?.reset()}
      startIcon={<AppIcon fontSize="small" name="refresh" />}
      variant="secondary"
    >
      Xóa lọc
    </Button>
  );

  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
      <Button startIcon={<AppIcon fontSize="small" name="filter" />} type="submit">Lọc</Button>
      {resetButton}
    </Box>
  );
}
