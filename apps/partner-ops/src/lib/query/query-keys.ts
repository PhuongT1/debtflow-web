const parties = ['parties'] as const;
const users = ['users'] as const;

/** Domain prefixes are shared by query definitions and mutation invalidation. */
export const queryKeys = {
  parties: {
    all: parties,
    list: (filters: Readonly<Record<string, string | undefined>>) =>
      [...parties, 'list', filters] as const,
    detail: (id: string) => [...parties, 'detail', id] as const,
  },
  users: {
    all: users,
    options: () => [...users, 'options'] as const,
  },
};
