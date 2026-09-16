'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Drawer } from '@mui/material';
import { designTokens } from '@debtflow/design-tokens';
import { navigationItems, type FrontendZone } from '@debtflow/navigation';
import type { AppLocale } from '@debtflow/contracts';
import { getStoredLocale, setStoredLocale } from '@debtflow/platform-sdk';
import { AppShellHeader } from './app-shell-header';
import { AppShellNavigation } from './app-shell-navigation';
import type { AppShellIdentity, AppShellVariant } from './app-shell.types';

const SIDEBAR_COOKIE = 'debt-flow-sidebar-collapsed';
const EXPANDED_WIDTH = designTokens.shell.sidebarExpanded;
const COLLAPSED_WIDTH = designTokens.shell.sidebarCollapsed;

export type { AppShellIdentity } from './app-shell.types';

type AppShellProps = {
  children: React.ReactNode;
  currentZone: FrontendZone;
  identity: AppShellIdentity;
  initialLocale?: AppLocale;
  initialSidebarCollapsed?: boolean;
  signOutHref?: string;
  variant?: AppShellVariant;
};

export function AppShell({
  children,
  currentZone,
  identity,
  initialLocale = 'vi',
  initialSidebarCollapsed = false,
  signOutHref = '/api/auth/signout',
  variant = 'main',
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocale] = useState<AppLocale>(initialLocale);
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasNavigation = variant === 'main';
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const isComposedOutlet = navigationItems
    .filter((item) => item.owner !== 'shell')
    .sort((left, right) => right.href.length - left.href.length)
    .some(
      (item) =>
        pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`)),
    );

  useEffect(() => setLocale(getStoredLocale()), []);
  useEffect(() => setMobileOpen(false), [pathname]);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      document.cookie = `${SIDEBAR_COOKIE}=${String(next)}; Path=/; Max-Age=31536000; SameSite=Lax`;
      return next;
    });
  }

  function switchLanguage(nextLocale: AppLocale) {
    setStoredLocale(nextLocale);
    setLocale(nextLocale);
    router.refresh();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <AppShellHeader
        collapsed={collapsed}
        hasNavigation={hasNavigation}
        identity={identity}
        locale={locale}
        onLocaleChange={switchLanguage}
        onMobileMenuOpen={() => setMobileOpen(true)}
        onSidebarToggle={toggleCollapsed}
        sidebarWidth={sidebarWidth}
        signOutHref={signOutHref}
      />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, minWidth: 0 }}>
        {hasNavigation ? (
          <Box
            component="aside"
            sx={{
              borderRight: '1px solid',
              borderColor: 'divider',
              display: { xs: 'none', md: 'block' },
              flex: `0 0 ${sidebarWidth}px`,
              minHeight: 0,
              width: sidebarWidth,
            }}
          >
            <AppShellNavigation collapsed={collapsed} currentZone={currentZone} locale={locale} />
          </Box>
        ) : null}
        {hasNavigation ? (
          <Drawer
            onClose={() => setMobileOpen(false)}
            open={mobileOpen}
            slotProps={{
              paper: {
                sx: { height: 'calc(100dvh - 56px)', top: 56, width: 280 },
              },
            }}
            sx={{ display: { xs: 'block', md: 'none' } }}
            variant="temporary"
          >
            <AppShellNavigation
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
            overflow: 'auto',
            p: isComposedOutlet ? 0 : { xs: 1.25, md: 1.5 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
