'use client';

import { useMemo } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { Alert, Box, Typography } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/page/card';
import { DataTable, type DataTableColumn } from '@/components/tables';
import { DetailList } from '@/components/ui/page/detail-list';
import { MetricGrid, Page, PageHeader, PageSplit } from '@/components/ui/page/page';
import { SectionCard } from '@/components/ui/page/section-card';
import { DetailPageSkeleton } from '@/components/skeletons/page-skeleton';
import { useParty } from '../hooks/use-party';
import { appRoutes } from '@/lib/routing/routes';
import { DebtStatus, DebtType } from '@/lib/domain';
import { getApiErrorMessage } from '@/lib/api/api-error';
import type { PartyDebt } from '@/models/party';

function remainingAmount(debt: PartyDebt) {
  return Number(debt.originalAmount) - Number(debt.paidAmount);
}

export function PartyDetails({ partyId }: { partyId: string }) {
  const t = useTranslations('PartyDetails');
  const apiText = useTranslations('Api');
  const format = useFormatter();
  const formatMoney = (value: string | number) =>
    t('money', { amount: format.number(Number(value), { maximumFractionDigits: 0 }) });
  const partyQuery = useParty({ id: partyId });
  const party = partyQuery.data;
  const metrics = useMemo(() => {
    const debts = party?.debts ?? [];
    const active = debts.filter(
      (debt) => debt.status !== DebtStatus.PAID && debt.status !== DebtStatus.CANCELLED,
    );
    const receivable = active
      .filter((debt) => debt.type === DebtType.RECEIVABLE)
      .reduce((sum, debt) => sum + remainingAmount(debt), 0);
    const payable = active
      .filter((debt) => debt.type === DebtType.PAYABLE)
      .reduce((sum, debt) => sum + remainingAmount(debt), 0);
    const overdue = active
      .filter((debt) => new Date(debt.dueDate).getTime() < Date.now())
      .reduce((sum, debt) => sum + remainingAmount(debt), 0);

    return { receivable, payable, overdue };
  }, [party]);

  if (partyQuery.isLoading) return <DetailPageSkeleton />;
  if (partyQuery.error || !party) {
    return <Alert severity="error">{getApiErrorMessage(partyQuery.error, apiText)}</Alert>;
  }

  const columns: Array<DataTableColumn<PartyDebt>> = [
    {
      key: 'code',
      header: t('code'),
      sticky: true,
      render: (debt) => (
        <Box>
          <Typography
            component="a"
            href={appRoutes.debts.detail(debt.id)}
            sx={{ color: 'primary.main', fontSize: 13.5, fontWeight: 750, textDecoration: 'none' }}
          >
            {debt.code}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 11.5 }}>
            {debt.type === DebtType.RECEIVABLE ? t('receivable') : t('payable')}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'document',
      header: t('document'),
      render: (debt) => debt.invoiceNo ?? debt.orderNo ?? debt.contractNo ?? '-',
    },
    {
      key: 'remaining',
      header: t('remaining'),
      align: 'right',
      render: (debt) => formatMoney(remainingAmount(debt)),
    },
    {
      key: 'dueDate',
      header: t('due'),
      render: (debt) => format.dateTime(new Date(debt.dueDate)),
    },
    {
      key: 'status',
      header: t('status'),
      render: (debt) => (
        <Badge
          tone={
            debt.status === DebtStatus.PAID
              ? 'green'
              : debt.status === DebtStatus.CANCELLED
                ? 'slate'
                : 'amber'
          }
        >
          {t(`statuses.${debt.status}`)}
        </Badge>
      ),
    },
  ];

  return (
    <Page>
      <PageHeader
        badge={<Badge tone="green">{t('active')}</Badge>}
        description={t('description', {
          code: party.code ?? t('noCode'),
          assignee: party.assignedTo?.name ?? t('unassigned'),
        })}
        parent={t('parent')}
        parentHref={appRoutes.parties.list}
        title={party.name}
      />

      <MetricGrid columns={5}>
        <StatCard
          icon="debts"
          label={t('receivableTotal')}
          value={formatMoney(metrics.receivable)}
        />
        <StatCard
          icon="download"
          label={t('payableTotal')}
          tone="amber"
          value={formatMoney(metrics.payable)}
        />
        <StatCard
          icon="calendar"
          label={t('overdue')}
          tone="red"
          value={formatMoney(metrics.overdue)}
        />
        <StatCard
          icon="aging"
          label={t('creditLimit')}
          value={party.creditLimit ? formatMoney(party.creditLimit) : t('notSet')}
        />
        <StatCard
          icon="list"
          label={t('debtCount')}
          tone="green"
          value={String(party.debts.length)}
        />
      </MetricGrid>

      <PageSplit
        aside={
          <SectionCard description={t('contactDescription')} title={t('contactTitle')}>
            <DetailList
              items={[
                { label: t('phone'), value: party.phone },
                { label: t('email'), value: party.email },
                { label: t('taxCode'), value: party.taxCode },
                { label: t('address'), value: party.address },
                { label: t('note'), value: party.note },
              ]}
            />
          </SectionCard>
        }
      >
        <DataTable
          columns={columns}
          emptyMessage={t('empty')}
          hrefForPage={() => appRoutes.parties.detail(party.id)}
          page={1}
          pageSize={party.debts.length || 20}
          pagination={false}
          rows={party.debts}
          title={t('debtsTitle')}
          total={party.debts.length}
        />
      </PageSplit>
    </Page>
  );
}
