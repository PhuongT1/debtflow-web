import 'server-only';
import { apiServer } from '@/lib/api/server';
import type { CatalogOptions } from '@/features/catalog/catalog.types';

export type { CatalogOptions } from '@/features/catalog/catalog.types';

export async function getCatalogOptions() {
  return apiServer.get<CatalogOptions>('catalog/options');
}
