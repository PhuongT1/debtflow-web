import { apiClient } from '@/lib/api/client';
import type { CatalogOptions } from '@/services/catalog.types';

export function getCatalogOptions() {
  return apiClient.get<CatalogOptions>('/api/catalog/options');
}
