import type { CatalogOptions } from '@/features/catalog/catalog.types';
import { apiClient } from '@/lib/api/client';

export function getCatalogOptions() {
  return apiClient.get<CatalogOptions>('/api/catalog/options');
}
