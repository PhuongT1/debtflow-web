import type { MetadataRoute } from 'next';

import { featurePath, productFeatures } from '@/features/product/catalog/product-features';
import { canIndex, siteUrl } from '@/lib/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!canIndex || !siteUrl) return [];

  const paths = ['/', featurePath, ...productFeatures.map(({ slug }) => `${featurePath}/${slug}`)];
  return paths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
