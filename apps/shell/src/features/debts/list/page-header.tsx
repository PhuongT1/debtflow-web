import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { FormDialog } from '@/components/ui/dialog/form-dialog';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { PageHeader } from '@/components/ui/page/page';
import { API_URL } from '@/lib/config/environment';

import { DebtForm } from '../forms/debt/debt-form';

import type { DebtsPageHeaderProps } from './page-header.types';

export type Translate = (key: string) => string;
export type UserOption = { id: string; name: string; email: string };

function buildExportHref(filters: Record<string, string | undefined>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) search.set(key, value);
  }

  return `${API_URL}/exports/debts?${search}`;
}

export function DebtsPageHeader({ filters, t, users }: DebtsPageHeaderProps) {
  const ui = useTranslations('Workspace');

  const HELP_STEPS = [
    ui('chooseACustomerThenReceivableIfTheyOweYou'),
    ui('enterTheAmountIssueDateDueDateAndAny'),
    ui('assignAnAccountOwnerAndAFollowUpDate'),
    ui('afterAPartialPaymentOpenTheDebtDetailsTo'),
  ];
  const HELP_TIPS = [
    ui('useFiltersToReviewDebtsByAccountOwnerOr'),
    ui('forDisputedDebtsSetTheCollectionStatusToDisputed'),
  ];

  return (
    <PageHeader
      title={t('title')}
      description={t('description')}
      actions={
        <>
          <FormDialog
            buttonLabel={t('create')}
            description={t('createDescription')}
            title={t('create')}
          >
            <DebtForm users={users} />
          </FormDialog>
          <HelpModal
            title={ui('howToManageDebts')}
            description={ui('trackEachCreditSaleOrAmountPayableAsA')}
            steps={HELP_STEPS}
            tips={HELP_TIPS}
          />
          <Button component={Link} href={buildExportHref(filters)} variant="secondary">
            {t('export')}
          </Button>
        </>
      }
    />
  );
}
