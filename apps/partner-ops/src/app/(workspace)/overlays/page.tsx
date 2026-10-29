import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { OverlaySurface } from '@packages/ui-react';
import { OverlayContent } from '@/components/platform/overlays/content';
import { partnerOpsEnv } from '@/lib/env';

/** One warm runtime serves all registered views; input selects a view, not a reload. */
export default async function OverlayRuntimePage() {
  if ((await headers()).get('x-debtflow-overlay') !== '1') notFound();
  return (
    <OverlaySurface deferPresentation hostOrigin={partnerOpsEnv.PLATFORM_ORIGIN}>
      <OverlayContent />
    </OverlaySurface>
  );
}
