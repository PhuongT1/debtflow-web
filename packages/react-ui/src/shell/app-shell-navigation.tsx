'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, List, ListItemButton, Tooltip, Typography } from '@mui/material';
import { getNavigationLabel, navigationItems, type FrontendZone } from '@debtflow/navigation';
import type { AppLocale } from '@debtflow/contracts';
import { AppIcon } from '../icons';

type AppShellNavigationProps = {
  collapsed: boolean;
  currentZone: FrontendZone;
  locale: AppLocale;
  onNavigate?: () => void;
};

export function AppShellNavigation({
  collapsed,
  currentZone,
  locale,
  onNavigate,
}: AppShellNavigationProps) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        height: '100%',
        overflowY: 'auto',
        p: collapsed ? 1 : 1.5,
      }}
    >
      {(['workspace', 'manage'] as const).map((group, index) => (
        <Box key={group} sx={{ mb: index === 0 ? 1.5 : 0 }}>
          {!collapsed ? (
            <Typography
              color="text.secondary"
              sx={{
                fontSize: 10.5,
                fontWeight: 800,
                mb: 0.75,
                px: 1.25,
                textTransform: 'uppercase',
              }}
            >
              {group === 'workspace'
                ? locale === 'en'
                  ? 'Operations'
                  : 'Vận hành'
                : locale === 'en'
                  ? 'System'
                  : 'Hệ thống'}
            </Typography>
          ) : null}
          <List component="nav" disablePadding sx={{ display: 'grid', gap: 0.25 }}>
            {navigationItems
              .filter((item) => item.group === group)
              .map((item) => {
                const label = getNavigationLabel(item, locale);
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                const crossZone = item.owner !== currentZone;
                const button = (
                  <ListItemButton
                    component={crossZone ? 'a' : Link}
                    href={item.href}
                    key={item.href}
                    onClick={onNavigate}
                    selected={active}
                    sx={{
                      borderRadius: 2,
                      color: active ? 'primary.dark' : 'text.secondary',
                      gap: 1.4,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      minHeight: 40,
                      px: collapsed ? 1 : 1.25,
                      '&.Mui-selected': { bgcolor: 'action.selected' },
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'text.primary',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: 'center',
                        color: active ? 'primary.main' : 'text.secondary',
                        display: 'flex',
                      }}
                    >
                      <AppIcon name={item.icon} />
                    </Box>
                    {!collapsed ? (
                      <Typography sx={{ fontSize: 13.5, fontWeight: active ? 750 : 600 }}>
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
