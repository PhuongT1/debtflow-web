import type { ReactNode } from 'react';
import { PublicPageLayout } from '@/components/layouts/public-page-layout';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PublicPageLayout>{children}</PublicPageLayout>;
}
