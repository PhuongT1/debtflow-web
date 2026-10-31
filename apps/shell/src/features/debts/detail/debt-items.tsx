import { useLocale, useTranslations } from 'next-intl';

import { SectionCard } from '@/components/ui/page/section-card';
import { formatMoney } from '@/lib/presentation/formatters';
import type { Debt } from '@/services/debt.server';
interface DebtItemsProps {
  items: Debt['items'];
}
export function DebtItems({ items }: DebtItemsProps) {
  const ui = useTranslations('Workspace');
  const locale = useLocale();
  return (
    <>
      {' '}
      {(items?.length ?? 0) > 0 ? (
        <SectionCard
          title={ui('documentItems')}
          description={ui('itemsAreSavedWithTheDebtForCategoryAnd')}
        >
          <div className="grid gap-2">
            {items?.map((item) => (
              <div
                className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                key={item.id}
              >
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-slate-500">
                    {[item.brandName, item.categoryName].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <p className="text-sm text-slate-600">
                  {item.quantity.toString()} {item.unit}
                </p>
                <p className="font-semibold">{formatMoney(item.lineAmount, locale)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </>
  );
}
