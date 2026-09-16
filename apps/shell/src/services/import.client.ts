import { apiClient } from '@/lib/api/client';
import { shellApiRoutes } from '@/lib/api/routes';

export function importDebtWorkbook(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post<{ createdDebts: number; createdParties: number }>(shellApiRoutes.imports.debtWorkbook, formData);
}
