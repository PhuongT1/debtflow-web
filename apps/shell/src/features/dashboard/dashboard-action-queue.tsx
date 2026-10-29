import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { designTokens } from '@packages/ui-tokens';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from '@/components/ui/page/section-card';
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
            <Box
              component={Link}
              sx={{
                display: 'block',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: `${designTokens.radius.md}px`,
                p: 1.5,
                bgcolor: 'background.paper',
                transition: 'border-color 160ms ease, background-color 160ms ease',
                '&:hover': { borderColor: designTokens.color.primaryText, bgcolor: 'action.hover' },
                '&:focus-visible': {
                  outline: `2px solid ${designTokens.color.primaryText}`,
                  outlineOffset: 2,
                },
              }}
              href={`/debts/${debt.id}`}
              key={debt.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: designTokens.color.primaryText }}
                  >
                    {debt.code}
                  </Typography>
                  <Typography
                    sx={{ mt: 0.5, fontSize: 14, fontWeight: 600, color: 'text.primary' }}
                  >
                    {debt.party.name}
                  </Typography>
                </div>
                <Badge tone="blue">{formatMoney(debt.remainingAmount)}</Badge>
              </div>
              <Typography color="text.secondary" sx={{ mt: 1, fontSize: 12 }}>
                Hạn: {debt.dueDate.toLocaleDateString('vi-VN')}
                {debt.nextFollowUpAt
                  ? ` · Nhắc: ${debt.nextFollowUpAt.toLocaleDateString('vi-VN')}`
                  : ''}
              </Typography>
            </Box>
          ))
        )}
      </div>
    </SectionCard>
  );
}
