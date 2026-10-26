import { Suspense } from 'react';
import { PartyList, PartyListSkeleton } from '@/features/parties';

export default function PartiesPage() {
  return (
    <Suspense fallback={<PartyListSkeleton />}>
      <PartyList />
    </Suspense>
  );
}
