import { apiClient } from '@/lib/api/client';
import { shellApiRoutes } from '@/lib/api/routes';

export function recordDebtPayment<T>(debtId: string, input: unknown) {
  return apiClient.post<T>(shellApiRoutes.debts.payments(debtId), input);
}

export function autoAllocatePayment<T>(input: unknown) {
  return apiClient.post<T>(shellApiRoutes.payments.autoAllocation, input);
}
