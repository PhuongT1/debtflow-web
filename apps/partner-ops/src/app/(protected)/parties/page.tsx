import { Suspense } from "react";
import { PartiesClient } from "@/features/parties/parties-client";
import { PartiesPageSkeleton } from "@/features/parties/parties-page-skeleton";

export default function PartiesPage() {
  return (
    <Suspense fallback={<PartiesPageSkeleton />}>
      <PartiesClient />
    </Suspense>
  );
}

