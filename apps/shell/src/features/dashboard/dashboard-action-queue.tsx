import Link from 'next/link';
import { Typography } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from '@/components/ui/section-card';
import type { DashboardQueueDebt } from '@/services/dashboard.server';
import { formatMoney } from '@/lib/presentation/formatters';

type DashboardActionQueueProps = {
  debts: DashboardQueueDebt[];
  description: string;
  emptyMessage: string;
  title: string;
};

export function DashboardActionQueue({
  debts,
  description,
  emptyMessage,
  title,
}: DashboardActionQueueProps) {
  return (
    <SectionCard description={description} title={title}>
      <div className="grid gap-2.5">
        {debts.length === 0 ? (
          <div className="grid min-h-36 place-items-center rounded-lg border border-dashed border-border px-4 text-center">
            <Typography color="text.secondary" variant="body2">
              {emptyMessage}
            </Typography>
          </div>
        ) : (
          debts.map((debt) => (
            <Link
              className="rounded-lg border border-border p-3 transition hover:border-blue-300 hover:bg-blue-50"
              href={`/debts/${debt.id}`}
              key={debt.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-blue-600">{debt.code}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                    {debt.party.name}
                  </p>
                </div>
                <Badge tone="blue">{formatMoney(debt.remainingAmount)}</Badge>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Hạn: {debt.dueDate.toLocaleDateString('vi-VN')}
                {debt.nextFollowUpAt
                  ? ` · Nhắc: ${debt.nextFollowUpAt.toLocaleDateString('vi-VN')}`
                  : ''}
              </p>
            </Link>
          ))
        )}
      </div>
    </SectionCard>
  );
}
