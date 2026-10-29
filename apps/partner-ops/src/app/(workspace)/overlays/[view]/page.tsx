import { partnerOverlayRoutes } from '@packages/platform-registry';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { OverlaySurface } from '@packages/ui-react';
import { OverlayContent } from '@/components/platform/overlays/content';
import { partnerOpsEnv } from '@/lib/env';

/** Host injection entry: middleware marks this protected content-only route.
 * The registered view renders here inside the Shell's overlay iframe; standalone
 * forms use the normal page/dialog and do not enter this route.
 */
export default async function OverlayPage({ params }: { params: Promise<{ view: string }> }) {
  if ((await headers()).get('x-debtflow-overlay') !== '1') notFound();
  const { view } = await params;
  if (!Object.hasOwn(partnerOverlayRoutes, view)) notFound();
  return (
    <OverlaySurface deferPresentation hostOrigin={partnerOpsEnv.PLATFORM_ORIGIN}>
      <OverlayContent />
    </OverlaySurface>
  );
}
