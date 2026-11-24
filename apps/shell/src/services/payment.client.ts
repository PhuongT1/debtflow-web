import type {
  AllocatePaymentRequest,
  CreatePaymentRequest,
  PaymentRecord,
} from '@packages/platform-contracts';

import { apiClient } from '@/lib/api/client';
import { shellApiRoutes } from '@/lib/api/routes';

export function recordDebtPayment(debtId: string, input: CreatePaymentRequest) {
  return apiClient.post<PaymentRecord>(shellApiRoutes.debts.payments(debtId), input);
}

export function autoAllocatePayment(input: AllocatePaymentRequest) {
  return apiClient.post<PaymentRecord>(shellApiRoutes.payments.autoAllocation, input);
}
