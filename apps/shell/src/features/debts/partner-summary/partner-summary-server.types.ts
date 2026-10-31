export type PartnerSummaryServerProps = {
  filters: Record<string, string | undefined>;
  users: Array<{ id: string; name: string; email: string }>;
};
