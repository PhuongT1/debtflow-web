'use client';

import { useState } from 'react';
import { Avatar, Box, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import type { AppLocale } from '@debtflow/contracts';
import { AppIcon } from '../icons';
import type { AppShellIdentity } from './app-shell.types';

type AppShellAccountMenuProps = {
  identity: AppShellIdentity;
  locale: AppLocale;
  signOutHref: string;
};

export function AppShellAccountMenu({ identity, locale, signOutHref }: AppShellAccountMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const displayName = identity.name ?? (locale === 'en' ? 'User' : 'Người dùng');

  return (
    <>
      <Box
        component="button"
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{
          alignItems: 'center',
          bgcolor: 'transparent',
          border: 0,
          borderRadius: 2,
          color: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          font: 'inherit',
          gap: 1,
          mr: { xs: 1, md: 2 },
          p: 0.5,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 750 }}>{displayName}</Typography>
          <Typography color="text.secondary" noWrap sx={{ fontSize: 10.5 }}>
            {identity.organization ? `${identity.organization.kind === 'BUSINESS' ? (locale === 'en' ? 'Business' : 'Doanh nghiệp') : (locale === 'en' ? 'Personal shop' : 'Shop cá nhân')} · ${identity.organization.name}` : (locale === 'en' ? 'Active' : 'Đang hoạt động')}
          </Typography>
        </Box>
        <Avatar
          sx={{
            bgcolor: 'primary.light',
            color: 'primary.dark',
            fontSize: 12,
            fontWeight: 800,
            height: 32,
            width: 32,
          }}
        >
          {displayName.trim().charAt(0).toUpperCase()}
        </Avatar>
      </Box>
      <Menu anchorEl={anchor} onClose={() => setAnchor(null)} open={Boolean(anchor)}>
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 750 }}>
            {displayName}
          </Typography>
          {identity.email ? (
            <Typography color="text.secondary" noWrap sx={{ fontSize: 12 }}>
              {identity.email}
            </Typography>
          ) : null}
          {identity.organization ? (
            <Typography color="text.secondary" noWrap sx={{ fontSize: 12, mt: 0.5 }}>
              {identity.organization.kind === 'BUSINESS' ? (locale === 'en' ? 'Business workspace' : 'Tổ chức doanh nghiệp') : (locale === 'en' ? 'Personal workspace' : 'Không gian cá nhân')}: {identity.organization.name}
            </Typography>
          ) : null}
          {identity.role ? (
            <Typography color="primary.main" sx={{ fontSize: 10.5, fontWeight: 800, mt: 0.75 }}>
              {identity.role}
            </Typography>
          ) : null}
        </Box>
        <Divider />
        <MenuItem component="a" href={signOutHref} sx={{ color: 'error.main', fontWeight: 650 }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <AppIcon name="logout" />
          </ListItemIcon>
          {locale === 'en' ? 'Sign out' : 'Đăng xuất'}
        </MenuItem>
      </Menu>
    </>
  );
}
