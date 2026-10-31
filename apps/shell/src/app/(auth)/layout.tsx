import { PublicPageLayout } from '@/components/layouts/public-page-layout';

import type { AuthLayoutProps } from './layout.types';

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <PublicPageLayout>{children}</PublicPageLayout>;
}
