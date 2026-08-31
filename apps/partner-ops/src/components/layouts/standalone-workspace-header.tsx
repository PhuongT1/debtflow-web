"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CoreIdentity } from "@debtflow/contracts";
import { navigationItems } from "@debtflow/navigation";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { AppIcon } from "@/components/ui/app-icon";

type StandaloneWorkspaceHeaderProps = {
  identity: CoreIdentity;
  platformOrigin: string;
};

const standaloneNavigation = [
  { href: "/", label: "Giới thiệu" },
  ...navigationItems
    .filter((item) => item.owner === "partner-ops")
    .map(({ href }) => ({ href, label: "Đối tác" })),
];

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");
}

/**
 * App-owned chrome for direct remote access. The local menu reads its domain
 * entry from the versioned neutral navigation contract. Platform chrome is not
 * imported: it is omitted entirely when the remote is composed.
 */
export function StandaloneWorkspaceHeader({
  identity,
  platformOrigin,
}: StandaloneWorkspaceHeaderProps) {
  const pathname = usePathname();
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
  const signOutHref = new URL("/api/auth/signout", platformOrigin).toString();

  return (
    <Box
      component="header"
      sx={{ borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          minHeight: 64,
          mx: "auto",
          maxWidth: 1440,
          px: { xs: 1.5, md: 2.5 },
          width: "100%",
        }}
      >
        <Stack spacing={0}>
          <Typography sx={{ fontSize: 16, fontWeight: 800 }}>
            Debt Flow · Đối tác
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 12 }}>
            Workspace quản lý khách hàng và nhà cung cấp
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <Stack spacing={0} sx={{ alignItems: "flex-end" }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              {identity.name}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 11 }}>
              {identity.role}
            </Typography>
          </Stack>
          <IconButton
            aria-controls={accountAnchor ? "partner-account-menu" : undefined}
            aria-expanded={accountAnchor ? "true" : undefined}
            aria-haspopup="menu"
            aria-label="Mở menu tài khoản"
            onClick={(event) => setAccountAnchor(event.currentTarget)}
            size="small"
          >
            <Avatar
              sx={{
                bgcolor: "primary.light",
                color: "primary.dark",
                fontSize: 13,
                fontWeight: 800,
                height: 32,
                width: 32,
              }}
            >
              {identity.name.slice(0, 1).toUpperCase()}
            </Avatar>
          </IconButton>
          <Button
            component={Link}
            href={platformOrigin}
            size="small"
            variant="outlined"
          >
            Platform
          </Button>
          <Menu
            anchorEl={accountAnchor}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            id="partner-account-menu"
            onClose={() => setAccountAnchor(null)}
            open={Boolean(accountAnchor)}
            slotProps={{ paper: { sx: { minWidth: 220 } } }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
          >
            <Box sx={{ px: 2, py: 1.25 }}>
              <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 750 }}>
                {identity.name}
              </Typography>
              <Typography color="text.secondary" noWrap sx={{ fontSize: 12 }}>
                {identity.email}
              </Typography>
              <Typography
                color="primary.main"
                sx={{ fontSize: 10.5, fontWeight: 800, mt: 0.75 }}
              >
                {identity.role}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              component="a"
              href={signOutHref}
              sx={{ color: "error.main", fontWeight: 650 }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <AppIcon fontSize="small" name="logout" />
              </ListItemIcon>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
      <Box
        component="nav"
        aria-label="Điều hướng Partner Operations"
        sx={{ borderTop: "1px solid", borderColor: "divider" }}
      >
        <Stack
          aria-label="Các khu vực của Partner Operations"
          direction="row"
          spacing={0.5}
          sx={{
            mx: "auto",
            maxWidth: 1440,
            overflowX: "auto",
            px: { xs: 1.5, md: 2.5 },
            py: 0.75,
            width: "100%",
          }}
        >
          {standaloneNavigation.map((item) => (
            <Button
              color={isActive(pathname, item.href) ? "primary" : "inherit"}
              component={Link}
              href={item.href}
              key={item.href}
              size="small"
              sx={{
                flexShrink: 0,
                fontWeight: isActive(pathname, item.href) ? 800 : 650,
              }}
              variant={isActive(pathname, item.href) ? "contained" : "text"}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
