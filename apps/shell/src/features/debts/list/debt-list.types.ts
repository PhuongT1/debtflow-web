export type DebtListProps = {
  filters: Record<string, string | undefined>;
  users: Array<{ id: string; name: string }>;
};
