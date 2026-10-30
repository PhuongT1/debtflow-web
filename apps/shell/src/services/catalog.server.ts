import 'server-only';

import type { CatalogOptions } from '@/features/catalog/catalog.types';
import { apiServer } from '@/lib/api/server';

export type { CatalogOptions } from '@/features/catalog/catalog.types';

export async function getCatalogOptions() {
  return apiServer.get<CatalogOptions>('catalog/options');
}
