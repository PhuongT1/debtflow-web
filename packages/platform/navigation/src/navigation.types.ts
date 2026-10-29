export type FrontendZone = 'shell' | 'partner-ops' | 'payments' | 'collection-ops';

export type NavigationIcon =
  'aging' | 'calendar' | 'dashboard' | 'debts' | 'import' | 'parties' | 'payments' | 'users';

export type NavigationItem = {
  href: string;
  label: string | { vi: string; en: string };
  icon: NavigationIcon;
  group: 'workspace' | 'manage';
  owner: FrontendZone;
  roles?: readonly string[];
};
