import type { MetadataRoute } from 'next';

import { canIndex, siteUrl } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: canIndex ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
