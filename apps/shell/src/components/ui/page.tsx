import Link from "next/link";
import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";

export function Page({ children, fillAvailable = false }: { children: React.ReactNode; fillAvailable?: boolean }) {
  return (
    <Box
      sx={{
        display: fillAvailable ? "flex" : "grid",
        flexDirection: fillAvailable ? "column" : undefined,
        gap: fillAvailable ? 1.5 : { xs: 2, md: 3 },
        height: fillAvailable ? { xs: "auto", md: "100%" } : undefined,
        minHeight: fillAvailable ? { md: 0 } : undefined,
        mx: "auto",
        maxWidth: fillAvailable ? "none" : 1500,
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  parent,
  parentHref = "/",
  badge,
  compact = false,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  parent?: string;
  parentHref?: string;
  badge?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <Box component="header" sx={{ alignItems: { md: compact ? "center" : "flex-start" }, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: compact ? 1.5 : 2, justifyContent: "space-between", minHeight: compact ? 0 : 76 }}>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 1.25 }}>
          <Typography component="h1" sx={{ fontSize: compact ? { xs: 22, md: 24 } : { xs: 25, md: 30 }, fontWeight: 800, lineHeight: 1.2 }}>{title}</Typography>
          {badge}
        </Box>
        {!compact ? (
          <Breadcrumbs separator="•" sx={{ mt: 1, "& .MuiBreadcrumbs-separator": { color: "text.disabled" } }}>
            <MuiLink color="text.secondary" component={Link} href={parentHref} sx={{ fontSize: 13, fontWeight: 600, textDecoration: "none", "&:hover": { color: "primary.main" } }}>
              {parent ?? "Dashboard"}
            </MuiLink>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>{title}</Typography>
          </Breadcrumbs>
        ) : null}
        {!compact && description ? <Typography color="text.secondary" sx={{ fontSize: 14, mt: 1.25, maxWidth: 720 }}>{description}</Typography> : null}
      </Box>
      {actions ? <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 1, pt: { md: compact ? 0 : 0.5 }, width: { xs: "100%", md: "auto" }, "& > *": { flex: { xs: "1 1 auto", sm: "0 0 auto" } } }}>{actions}</Box> : null}
    </Box>
  );
}

export function PageGrid({ children, columns = 2 }: { children: React.ReactNode; columns?: 2 | 3 }) {
  return <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", xl: columns === 3 ? "repeat(3, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))" } }}>{children}</Box>;
}

export function MetricGrid({ children, columns = 4 }: { children: React.ReactNode; columns?: 4 | 5 }) {
  return <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: `repeat(${columns}, minmax(0, 1fr))` } }}>{children}</Box>;
}

export function PageSplit({ aside, children, asideWidth = 360 }: { aside: React.ReactNode; children: React.ReactNode; asideWidth?: number }) {
  return <Box sx={{ alignItems: "start", display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", xl: `${asideWidth}px minmax(0, 1fr)` } }}><Box>{aside}</Box><Box sx={{ minWidth: 0 }}>{children}</Box></Box>;
}
