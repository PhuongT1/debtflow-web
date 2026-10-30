import type { ReactNode } from 'react';

import { PublicPageLayout } from '@/components/layouts/public-page-layout';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicPageLayout>{children}</PublicPageLayout>;
}
