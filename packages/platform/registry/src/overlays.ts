import { partnerOverlayRoutes } from './registrations/partner-ops/overlay-routes';

/** The host resolves trusted routes; remote requests supply view IDs, never URLs. */
export function getApplicationOverlayViews(
  appName: string,
  proxyPath: string,
): Record<string, string> {
  if (appName !== 'partner-ops') return {};
  return Object.fromEntries(
    Object.entries(partnerOverlayRoutes).map(([view, path]) => [view, `${proxyPath}${path}`]),
  );
}
