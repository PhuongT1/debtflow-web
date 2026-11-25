import type { Metadata } from 'next';

import { canIndex, siteName, siteUrl } from './site';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = siteUrl && new URL(path, siteUrl).href;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title, description, siteName, type: 'website', locale: 'vi_VN', url: canonical },
    robots: { index: canIndex, follow: true },
  };
}
