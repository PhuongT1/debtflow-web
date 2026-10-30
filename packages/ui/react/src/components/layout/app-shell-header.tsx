'use client';

import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';

import { AppIcon } from '../../icons/app-icon';

import type { AppShellHeaderProps } from './app-shell.types';
import { AppShellAccountMenu } from './app-shell-account-menu';
import { AppShellLocaleMenu } from './app-shell-locale-menu';

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
  onSignOut,
}: AppShellHeaderProps) {
  const theme = useTheme();
  const brand =
    locale === 'vi'
      ? { title: 'Web công nợ', subtitle: 'Phải thu · phải trả' }
      : { title: 'Debt Flow', subtitle: 'Receivables · payables' };

  return (
    <Box
      component="header"
      sx={{
        alignItems: 'center',
        backdropFilter: 'blur(14px)',
        bgcolor: `color-mix(in srgb, ${(theme.vars ?? theme).palette.background.paper} 92%, transparent)`,
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
          justifyContent:
            collapsed && hasNavigation ? { xs: 'flex-start', md: 'center' } : 'flex-start',
          minWidth: 0,
          position: 'relative',
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
            border: '1px solid',
            borderColor: `color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.contrastText} 18%, transparent)`,
            borderRadius: 1.5,
            boxShadow: theme.customShadows.primary,
            color: 'primary.contrastText',
            display: 'grid',
            flex: '0 0 auto',
            height: 36,
            placeItems: 'center',
            width: 36,
          }}
        >
          <AppIcon aria-hidden name="debts" sx={{ fontSize: 21 }} />
        </Box>
        {!collapsed || !hasNavigation ? (
          <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
            <Typography noWrap component="p" variant="headerTitle">
              {brand.title}
            </Typography>
            <Typography color="text.secondary" noWrap component="p" variant="headerSubtitle">
              {brand.subtitle}
            </Typography>
          </Box>
        ) : null}
        {hasNavigation ? (
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'absolute',
              right: -15,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          >
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
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: theme.customShadows.surface,
                  height: 30,
                  width: 30,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <AppIcon
                  name="collapse"
                  sx={{
                    fontSize: 20,
                    transform: collapsed ? 'rotate(180deg)' : 'none',
                    transition: theme.transitions.create('transform'),
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        ) : null}
      </Box>
      <Box sx={{ flex: 1 }} />
      <AppShellLocaleMenu locale={locale} onLocaleChange={onLocaleChange} />
      <AppShellAccountMenu
        identity={identity}
        locale={locale}
        signOutHref={signOutHref}
        onSignOut={onSignOut}
      />
    </Box>
  );
}
