"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { AppIcon } from "../icons";
import {
  getNavigationLabel,
  navigationItems,
  type FrontendZone,
} from "@debtflow/navigation";
import { designTokens } from "@debtflow/design-tokens";
import type { AppLocale } from "@debtflow/contracts";
import { getStoredLocale, setStoredLocale } from "@debtflow/platform-sdk";

const SIDEBAR_COOKIE = "debt-flow-sidebar-collapsed";
const EXPANDED_WIDTH = designTokens.shell.sidebarExpanded;
const COLLAPSED_WIDTH = designTokens.shell.sidebarCollapsed;

export type AppShellIdentity = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

function Navigation({
  collapsed,
  currentZone,
  locale = "vi",
  onNavigate,
}: {
  collapsed: boolean;
  currentZone: FrontendZone;
  locale?: AppLocale;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        height: "100%",
        overflowY: "auto",
        p: collapsed ? 1 : 1.5,
      }}
    >
      {(["workspace", "manage"] as const).map((group, index) => (
        <Box key={group} sx={{ mb: index === 0 ? 1.5 : 0 }}>
          {!collapsed ? (
            <Typography
              color="text.secondary"
              sx={{
                fontSize: 10.5,
                fontWeight: 800,
                mb: 0.75,
                px: 1.25,
                textTransform: "uppercase",
              }}
            >
              {group === "workspace"
                ? locale === "en"
                  ? "Operations"
                  : "Vận hành"
                : locale === "en"
                  ? "System"
                  : "Hệ thống"}
            </Typography>
          ) : null}
          <List
            component="nav"
            disablePadding
            sx={{ display: "grid", gap: 0.25 }}
          >
            {navigationItems
              .filter((item) => item.group === group)
              .map((item) => {
                const label = getNavigationLabel(item, locale);
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const crossZone = item.owner !== currentZone;
                const button = (
                  <ListItemButton
                    component={crossZone ? "a" : Link}
                    href={item.href}
                    key={item.href}
                    onClick={onNavigate}
                    selected={active}
                    sx={{
                      borderRadius: 2,
                      color: active ? "primary.dark" : "text.secondary",
                      gap: 1.4,
                      justifyContent: collapsed ? "center" : "flex-start",
                      minHeight: 40,
                      px: collapsed ? 1 : 1.25,
                      "&.Mui-selected": { bgcolor: "action.selected" },
                      "&:hover": {
                        bgcolor: "action.hover",
                        color: "text.primary",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: "center",
                        color: active ? "primary.main" : "text.secondary",
                        display: "flex",
                      }}
                    >
                      <AppIcon name={item.icon} />
                    </Box>
                    {!collapsed ? (
                      <Typography
                        sx={{ fontSize: 13.5, fontWeight: active ? 750 : 600 }}
                      >
                        {label}
                      </Typography>
                    ) : null}
                  </ListItemButton>
                );
                return collapsed ? (
                  <Tooltip key={item.href} placement="right" title={label}>
                    {button}
                  </Tooltip>
                ) : (
                  button
                );
              })}
          </List>
        </Box>
      ))}
    </Box>
  );
}

export function AppShell({
  children,
  currentZone,
  identity,
  initialLocale = "vi",
  initialSidebarCollapsed = false,
  signOutHref = "/api/auth/signout",
  variant = "main",
}: {
  children: React.ReactNode;
  currentZone: FrontendZone;
  identity: AppShellIdentity;
  initialLocale?: AppLocale;
  initialSidebarCollapsed?: boolean;
  signOutHref?: string;
  variant?: "main" | "minimal";
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const [locale, setLocale] = useState<AppLocale>(initialLocale);
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
  const [langAnchor, setLangAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      document.cookie = `${SIDEBAR_COOKIE}=${String(next)}; Path=/; Max-Age=31536000; SameSite=Lax`;
      return next;
    });
  }

  function handleSwitchLanguage(nextLocale: AppLocale) {
    setStoredLocale(nextLocale);
    setLocale(nextLocale);
    setLangAnchor(null);
    window.location.reload();
  }

  const displayName = identity.name ?? (locale === "en" ? "User" : "Người dùng");
  const hasNavigation = variant === "main";
  // A composed micro frontend owns every pixel inside the application outlet.
  // Platform still owns the surrounding header and navigation. Keeping this
  // decision here prevents every remote from compensating for shell padding.
  const composedNavigationItem = navigationItems
    .filter((item) => item.owner !== "shell")
    .sort((left, right) => right.href.length - left.href.length)
    .find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
    );
  const isComposedOutlet = Boolean(composedNavigationItem);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        component="header"
        sx={{
          alignItems: "center",
          backdropFilter: "blur(14px)",
          bgcolor: alpha(theme.palette.background.paper, 0.92),
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexShrink: 0,
          height: 56,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            alignSelf: "stretch",
            display: "flex",
            flex: hasNavigation
              ? {
                  xs: "0 1 auto",
                  md: `0 0 ${collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH}px`,
                }
              : "0 1 auto",
            gap: 1,
            minWidth: 0,
            px: 1.5,
          }}
        >
          <Box
            sx={{
              display: hasNavigation ? { xs: "flex", md: "none" } : "none",
            }}
          >
            <Tooltip title={locale === "en" ? "Open menu" : "Mở menu"}>
              <IconButton
                aria-label={locale === "en" ? "Open menu" : "Mở menu"}
                onClick={() => setMobileOpen(true)}
                size="small"
              >
                <AppIcon name="menu" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: 2,
              color: "primary.contrastText",
              display: "grid",
              flex: "0 0 auto",
              fontSize: 13,
              fontWeight: 850,
              height: 34,
              placeItems: "center",
              width: 34,
            }}
          >
            DF
          </Box>
          {!collapsed || !hasNavigation ? (
            <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontSize: 15, fontWeight: 850, lineHeight: 1.15 }}
              >
                Debt Flow
              </Typography>
              <Typography color="text.secondary" noWrap sx={{ fontSize: 10.5 }}>
                Finance workspace
              </Typography>
            </Box>
          ) : null}
          {hasNavigation ? (
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto" }}>
              <Tooltip
                title={
                  collapsed
                    ? locale === "en"
                      ? "Expand sidebar"
                      : "Mở rộng menu"
                    : locale === "en"
                      ? "Collapse sidebar"
                      : "Thu gọn menu"
                }
              >
                <IconButton
                  aria-label="Đóng/mở sidebar"
                  onClick={toggleCollapsed}
                  size="small"
                  sx={{ transform: collapsed ? "rotate(180deg)" : "none" }}
                >
                  <AppIcon name="collapse" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : null}
        </Box>
        <Box sx={{ flex: 1 }} />

        {/* Language Switcher */}
        <Box sx={{ mr: 1.5 }}>
          <Button
            color="inherit"
            onClick={(event) => setLangAnchor(event.currentTarget)}
            size="small"
            sx={{
              bgcolor: "action.hover",
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 750,
              minWidth: 64,
              px: 1.25,
              py: 0.5,
              textTransform: "none",
            }}
          >
            {locale === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}
          </Button>
          <Menu
            anchorEl={langAnchor}
            onClose={() => setLangAnchor(null)}
            open={Boolean(langAnchor)}
          >
            <MenuItem
              onClick={() => handleSwitchLanguage("vi")}
              selected={locale === "vi"}
              sx={{ fontSize: 13, fontWeight: locale === "vi" ? 750 : 500 }}
            >
              🇻🇳 Tiếng Việt (VI)
            </MenuItem>
            <MenuItem
              onClick={() => handleSwitchLanguage("en")}
              selected={locale === "en"}
              sx={{ fontSize: 13, fontWeight: locale === "en" ? 750 : 500 }}
            >
              🇬🇧 English (EN)
            </MenuItem>
          </Menu>
        </Box>

        <Box
          component="button"
          onClick={(event) => setAccountAnchor(event.currentTarget)}
          sx={{
            alignItems: "center",
            bgcolor: "transparent",
            border: 0,
            borderRadius: 2,
            color: "inherit",
            cursor: "pointer",
            display: "flex",
            font: "inherit",
            gap: 1,
            mr: { xs: 1, md: 2 },
            p: 0.5,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Box
            sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}
          >
            <Typography sx={{ fontSize: 12.5, fontWeight: 750 }}>
              {displayName}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 10.5 }}>
              {locale === "en" ? "Active" : "Đang hoạt động"}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: "primary.light",
              color: "primary.dark",
              fontSize: 12,
              fontWeight: 800,
              height: 32,
              width: 32,
            }}
          >
            {displayName.trim().charAt(0).toUpperCase()}
          </Avatar>
        </Box>
        <Menu
          anchorEl={accountAnchor}
          onClose={() => setAccountAnchor(null)}
          open={Boolean(accountAnchor)}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 750 }}>
              {displayName}
            </Typography>
            {identity.email ? (
              <Typography color="text.secondary" noWrap sx={{ fontSize: 12 }}>
                {identity.email}
              </Typography>
            ) : null}
            {identity.role ? (
              <Typography
                color="primary.main"
                sx={{ fontSize: 10.5, fontWeight: 800, mt: 0.75 }}
              >
                {identity.role}
              </Typography>
            ) : null}
          </Box>
          <Divider />
          <MenuItem
            component="a"
            href={signOutHref}
            sx={{ color: "error.main", fontWeight: 650 }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <AppIcon name="logout" />
            </ListItemIcon>
            {locale === "en" ? "Sign out" : "Đăng xuất"}
          </MenuItem>
        </Menu>
      </Box>
      <Box sx={{ display: "flex", flex: 1, minHeight: 0, minWidth: 0 }}>
        {hasNavigation ? (
          <Box
            component="aside"
            sx={{
              borderRight: "1px solid",
              borderColor: "divider",
              display: { xs: "none", md: "block" },
              flex: `0 0 ${collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH}px`,
              minHeight: 0,
              width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
            }}
          >
            <Navigation
              collapsed={collapsed}
              currentZone={currentZone}
              locale={locale}
            />
          </Box>
        ) : null}
        {hasNavigation ? (
          <Drawer
            onClose={() => setMobileOpen(false)}
            open={mobileOpen}
            slotProps={{
              paper: {
                sx: { height: "calc(100dvh - 56px)", top: 56, width: 280 },
              },
            }}
            sx={{ display: { xs: "block", md: "none" } }}
            variant="temporary"
          >
            <Navigation
              collapsed={false}
              currentZone={currentZone}
              locale={locale}
              onNavigate={() => setMobileOpen(false)}
            />
          </Drawer>
        ) : null}
        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: "auto",
            p: { xs: 1.25, md: 1.5 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
