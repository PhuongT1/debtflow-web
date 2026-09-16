'use client';

import { alpha, Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import type { AppLocale } from '@debtflow/contracts';
import { AppIcon } from '../icons';
import { AppShellAccountMenu } from './app-shell-account-menu';
import { AppShellLocaleMenu } from './app-shell-locale-menu';
import type { AppShellIdentity } from './app-shell.types';

type AppShellHeaderProps = {
  collapsed: boolean;
  hasNavigation: boolean;
  identity: AppShellIdentity;
  locale: AppLocale;
  onLocaleChange: (locale: AppLocale) => void;
  onMobileMenuOpen: () => void;
  onSidebarToggle: () => void;
  sidebarWidth: number;
  signOutHref: string;
};

export function AppShellHeader({
  collapsed,
  hasNavigation,
  identity,
  locale,
  onLocaleChange,
  onMobileMenuOpen,
  onSidebarToggle,
  sidebarWidth,
  signOutHref,
}: AppShellHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      component="header"
      sx={{
        alignItems: 'center',
        backdropFilter: 'blur(14px)',
        bgcolor: alpha(theme.palette.background.paper, 0.92),
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexShrink: 0,
        height: 56,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          alignSelf: 'stretch',
          display: 'flex',
          flex: hasNavigation ? { xs: '0 1 auto', md: `0 0 ${sidebarWidth}px` } : '0 1 auto',
          gap: 1,
          minWidth: 0,
          px: 1.5,
        }}
      >
        <Box sx={{ display: hasNavigation ? { xs: 'flex', md: 'none' } : 'none' }}>
          <Tooltip title={locale === 'en' ? 'Open menu' : 'Mở menu'}>
            <IconButton
              aria-label={locale === 'en' ? 'Open menu' : 'Mở menu'}
              onClick={onMobileMenuOpen}
              size="small"
            >
              <AppIcon name="menu" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            bgcolor: 'primary.main',
            borderRadius: 2,
            color: 'primary.contrastText',
            display: 'grid',
            flex: '0 0 auto',
            fontSize: 13,
            fontWeight: 850,
            height: 34,
            placeItems: 'center',
            width: 34,
          }}
        >
          DF
        </Box>
        {!collapsed || !hasNavigation ? (
          <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 15, fontWeight: 850, lineHeight: 1.15 }}>
              Debt Flow
            </Typography>
            <Typography color="text.secondary" noWrap sx={{ fontSize: 10.5 }}>
              Finance workspace
            </Typography>
          </Box>
        ) : null}
        {hasNavigation ? (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 'auto' }}>
            <Tooltip
              title={
                collapsed
                  ? locale === 'en'
                    ? 'Expand sidebar'
                    : 'Mở rộng menu'
                  : locale === 'en'
                    ? 'Collapse sidebar'
                    : 'Thu gọn menu'
              }
            >
              <IconButton
                aria-label={locale === 'en' ? 'Toggle sidebar' : 'Đóng/mở sidebar'}
                onClick={onSidebarToggle}
                size="small"
                sx={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}
              >
                <AppIcon name="collapse" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : null}
      </Box>
      <Box sx={{ flex: 1 }} />
      <AppShellLocaleMenu locale={locale} onLocaleChange={onLocaleChange} />
      <AppShellAccountMenu identity={identity} locale={locale} signOutHref={signOutHref} />
    </Box>
  );
}
