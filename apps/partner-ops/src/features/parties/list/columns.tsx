import Link from 'next/link';
import { Box } from '@mui/material';
import { AppIcon } from '@/components/ui/app-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClampedText } from '@/components/ui/clamped-text';
import { DeletePartyButton } from './delete-party-button';
import type { DataTableColumn } from '@/components/tables';
import { FormDialog } from '@/components/ui/dialog/form-dialog';
import { PartyForm } from '@/features/parties/form/party-form';
import { getPartyTableColumns } from './table-columns';
import { appRoutes } from '@/lib/routing/routes';
import { PartyType } from '@/lib/domain';
import { navigateToPlatform } from '@/lib/platform-navigation';
import type { Party } from '@/models/party';
import type { UserSummary } from '@/models/user';

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
  formatMoney: (value: string | number) => string;
};

export function getPartyListColumns({
  activeUsers,
  labels,
  formatMoney,
}: PartyListColumnsOptions): Array<DataTableColumn<Party>> {
  const tableColumns = getPartyTableColumns(labels);

  return [
    {
      ...tableColumns.name,
      render: (party) => (
        <Link className="font-semibold text-blue-600" href={appRoutes.parties.detail(party.id)}>
          <ClampedText title={party.name}>{party.name}</ClampedText>
        </Link>
      ),
    },
    {
      ...tableColumns.type,
      render: (party) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Badge
            tone={
              party.type === PartyType.CUSTOMER
                ? 'blue'
                : party.type === PartyType.SUPPLIER
                  ? 'amber'
                  : 'slate'
            }
          >
            {party.type === PartyType.CUSTOMER
              ? labels.customer
              : party.type === PartyType.SUPPLIER
                ? labels.supplier
                : labels.both}
          </Badge>
        </Box>
      ),
    },
    {
      ...tableColumns.sale,
      render: (party) => <Box sx={{ whiteSpace: 'nowrap' }}>{party.assignedTo?.name ?? '-'}</Box>,
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
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'nowrap',
            gap: 1,
            whiteSpace: 'nowrap',
            '& > *': { flexShrink: 0 },
          }}
        >
          <Button
            aria-label={labels.viewPayments}
            onClick={() => navigateToPlatform(appRoutes.payments.forParty(party.id))}
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
              partyId={party.id}
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
          <DeletePartyButton
            id={party.id}
            confirmMessage={labels.deleteMessage}
            label={labels.delete}
          />
        </Box>
      ),
    },
  ];
}
