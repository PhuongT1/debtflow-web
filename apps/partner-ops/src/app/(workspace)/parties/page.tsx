import { Suspense } from 'react';
import { PartiesClient, PartiesPageSkeleton } from '@/features/parties';

export default function PartiesPage() {
  return (
    <Suspense fallback={<PartiesPageSkeleton />}>
      <PartiesClient />
    </Suspense>
  );
}
