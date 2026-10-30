import type { ReactNode } from 'react';

import type { AppLocale } from '@packages/platform-contracts';
import type { FrontendZone } from '@packages/platform-navigation';

import type { AppShellIdentity, AppShellVariant } from '../../components/layout/app-shell.types';

export type AppShellProps = {
  children: ReactNode;
  currentZone: FrontendZone;
  identity: AppShellIdentity;
  initialLocale?: AppLocale;
  initialSidebarCollapsed?: boolean;
  signOutHref?: string;
  onSignOut?: () => void;
  variant?: AppShellVariant;
};

export type AppShellNavigationProps = {
  collapsed: boolean;
  currentZone: FrontendZone;
  locale: AppLocale;
  onNavigate?: () => void;
};

export type AppPaginationLinksProps = {
  page: number;
  pageSize: number;
  total: number;
  hrefByPage: Record<number, string>;
};
