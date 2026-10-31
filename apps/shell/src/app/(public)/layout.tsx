import { PublicPageLayout } from '@/components/layouts/public-page-layout';

import type { PublicLayoutProps } from './layout.types';

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <PublicPageLayout>{children}</PublicPageLayout>;
}
