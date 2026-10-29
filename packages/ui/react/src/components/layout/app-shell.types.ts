import type { AppLocale } from '@packages/platform-contracts';

export type AppShellIdentity = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  organization?: { name: string; kind: 'PERSONAL' | 'BUSINESS'; role: string };
};

export type AppShellVariant = 'main' | 'minimal';

export type AppShellHeaderProps = {
  collapsed: boolean;
  hasNavigation: boolean;
  identity: AppShellIdentity;
  locale: AppLocale;
  onLocaleChange: (locale: AppLocale) => void;
  onMobileMenuOpen: () => void;
  onSidebarToggle: () => void;
  sidebarWidth: number;
  signOutHref: string;
  onSignOut?: () => void;
};

export type AppShellAccountMenuProps = {
  identity: AppShellIdentity;
  locale: AppLocale;
  signOutHref: string;
  onSignOut?: () => void;
};

export type AppShellLocaleMenuProps = {
  locale: AppLocale;
  onLocaleChange: (locale: AppLocale) => void;
};
