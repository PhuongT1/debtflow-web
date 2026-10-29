import type { AppLocale } from '@packages/platform-contracts';

export const DEBTFLOW_EVENT_VERSION = 1 as const;

export interface DebtflowEventMap {
  'identity:signed-out': { reason?: string };
  'party:changed': {
    partyId: string;
    operation: 'created' | 'updated' | 'deactivated';
  };
  'locale:changed': { locale: AppLocale };
}
