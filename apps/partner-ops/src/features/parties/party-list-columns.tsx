import Link from 'next/link';
import { Box } from '@mui/material';
import { AppIcon } from '@/components/ui/app-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClampedText } from '@/components/ui/clamped-text';
import { ConfirmActionButton } from '@/components/ui/confirm-action-button';
import type { DataTableColumn } from '@/components/ui/data-table';
import { FormDialog } from '@/components/ui/form-dialog';
import { PartyForm } from '@/features/parties/party-form';
import { getPartyTableColumns } from '@/features/parties/table-config';
import { formatMoney } from '@/lib/formatters';
import { navigateToPlatform } from '@/lib/platform-navigation';
import type { Party, UserSummary } from './party-list.types';

type PartyListColumnLabels = {
  actions: string;
  both: string;
  contact: string;
  customer: string;
  delete: string;
  deleteMessage: string;
  name: string;
  payable: string;
  receivable: string;
  payments: string;
  sale: string;
  save: string;
  supplier: string;
  type: string;
  view: string;
  viewDescription: string;
  viewDialog: (name: string) => string;
  viewPayments: string;
};

type PartyListColumnsOptions = {
  activeUsers: UserSummary[];
  labels: PartyListColumnLabels;
};

export function getPartyListColumns({
  activeUsers,
  labels,
}: PartyListColumnsOptions): Array<DataTableColumn<Party>> {
  const tableColumns = getPartyTableColumns(labels);

  return [
    {
      ...tableColumns.name,
      render: (party) => (
        <Link className="font-semibold text-blue-600" href={`/parties/${party.id}`}>
          <ClampedText title={party.name}>{party.name}</ClampedText>
        </Link>
      ),
    },
    {
      ...tableColumns.type,
      render: (party) => (
        <Badge
          tone={party.type === 'CUSTOMER' ? 'blue' : party.type === 'SUPPLIER' ? 'amber' : 'slate'}
        >
          {party.type === 'CUSTOMER'
            ? labels.customer
            : party.type === 'SUPPLIER'
              ? labels.supplier
              : labels.both}
        </Badge>
      ),
    },
    {
      ...tableColumns.sale,
      render: (party) => party.assignedTo?.name ?? '-',
    },
    {
      ...tableColumns.contact,
      render: (party) => (
        <div>
          <p>{party.phone ?? '-'}</p>
          <p className="text-sm text-slate-500">{party.email ?? ''}</p>
        </div>
      ),
    },
    {
      ...tableColumns.receivable,
      render: (party) =>
        Number(party.balance.receivable) > 0 ? formatMoney(party.balance.receivable) : '-',
    },
    {
      ...tableColumns.payable,
      render: (party) =>
        Number(party.balance.payable) > 0 ? formatMoney(party.balance.payable) : '-',
    },
    {
      ...tableColumns.actions,
      render: (party) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            aria-label={labels.viewPayments}
            onClick={() => navigateToPlatform(`/payments?partyId=${encodeURIComponent(party.id)}`)}
            size="small"
            startIcon={<AppIcon fontSize="small" name="payments" />}
            type="button"
            variant="secondary"
          >
            {labels.payments}
          </Button>
          <FormDialog
            buttonIcon="visibility"
            buttonLabel={labels.view}
            buttonSize="small"
            buttonVariant="secondary"
            description={labels.viewDescription}
            iconOnly
            title={labels.viewDialog(party.name)}
          >
            <PartyForm
              endpoint={`/api/parties/${party.id}`}
              method="PATCH"
              submitLabel={labels.save}
              users={activeUsers}
              initialValues={{
                type: party.type,
                code: party.code ?? '',
                name: party.name,
                phone: party.phone ?? '',
                email: party.email ?? '',
                taxCode: party.taxCode ?? '',
                creditLimit: party.creditLimit?.toString() ?? '',
                assignedToId: party.assignedToId ?? '',
                address: party.address ?? '',
                provinceCode: party.provinceCode ?? '',
                provinceName: party.provinceName ?? '',
                note: party.note ?? '',
              }}
            />
          </FormDialog>
          <ConfirmActionButton
            endpoint={`/api/parties/${party.id}`}
            confirmMessage={labels.deleteMessage}
            label={labels.delete}
            invalidateQueryKey={['parties']}
            refreshRoute={false}
          />
        </Box>
      ),
    },
  ];
}
