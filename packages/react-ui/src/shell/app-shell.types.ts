export type AppShellIdentity = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  organization?: { name: string; kind: 'PERSONAL' | 'BUSINESS'; role: string };
};

export type AppShellVariant = 'main' | 'minimal';
