import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Page } from '@/components/ui/page';
import { cn } from '@/lib/styling/class-names';
import { listUserOptions } from '@/services/user.server';
import { PartnerSummaryServer } from '../partner-summary/partner-summary-server';
import { DebtList } from './debt-list';
import { DebtsPageHeader } from './page-header';

const debtViews = [
  { label: 'customerOwes', href: '/debts?type=RECEIVABLE&outstanding=true', tone: 'primary' },
  { label: 'supplierOwed', href: '/debts?type=PAYABLE&outstanding=true', tone: 'default' },
  {
    label: 'receivableOverdue',
    href: '/debts?type=RECEIVABLE&outstanding=true&overdue=true',
    tone: 'danger',
  },
  {
    label: 'payableOverdue',
    href: '/debts?type=PAYABLE&outstanding=true&overdue=true',
    tone: 'danger',
  },
] as const;

export default async function DebtsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [filters, users, t] = await Promise.all([
    searchParams,
    listUserOptions(),
    getTranslations('Debts'),
  ]);
  const activeUsers = users
    .filter((user) => user.status === 'ACTIVE')
    .sort((a, b) => a.name.localeCompare(b.name));
  const isPartnerSummary = !filters.partyId;

  return (
    <Page fillAvailable>
      <DebtsPageHeader filters={filters} t={t} users={activeUsers} />

      {!isPartnerSummary ? (
        <div className="flex flex-wrap gap-2">
          {debtViews.map(({ label, href, tone }) => (
            <Link
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-semibold',
                tone === 'primary' && 'bg-slate-900 text-white',
                tone === 'default' && 'border border-border bg-white text-slate-700',
                tone === 'danger' && 'border border-red-200 bg-red-50 text-red-700',
              )}
              href={href}
              key={href}
            >
              {t(label)}
            </Link>
          ))}
        </div>
      ) : null}
      {isPartnerSummary ? (
        <PartnerSummaryServer filters={filters} users={activeUsers} />
      ) : (
        <DebtList filters={filters} users={activeUsers} />
      )}
    </Page>
  );
}
