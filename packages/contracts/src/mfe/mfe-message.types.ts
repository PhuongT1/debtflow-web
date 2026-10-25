/**
 * Stable browser contract between the Platform host and an iframe remote.
 * Keep this framework-neutral: Angular, React, Vue, etc. can emit the same
 * postMessage payload without importing host implementation details.
 */
export const MFE_HOST_MESSAGE_VERSION = 1 as const;
export const MFE_ROUTE_SYNC_CAPABILITY = 'route-sync-v1' as const;

export function isMfeRoutePath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\') &&
    [...value].every((character) => character.charCodeAt(0) > 32)
  );
}

/** Host-directed navigation within an already mounted iframe application. */
export interface MfeRouteChangedMessage {
  source: 'platform';
  version: typeof MFE_HOST_MESSAGE_VERSION;
  type: 'debtflow:route-changed';
  path: string;
}

export function isMfeRouteChangedMessage(value: unknown): value is MfeRouteChangedMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return (
    message['source'] === 'platform' &&
    message['version'] === MFE_HOST_MESSAGE_VERSION &&
    message['type'] === 'debtflow:route-changed' &&
    isMfeRoutePath(message['path'])
  );
}

import type { AppLocale } from '../i18n/locale.types';

export interface MfeLocaleChangedMessage {
  source: 'platform';
  version: typeof MFE_HOST_MESSAGE_VERSION;
  type: 'debtflow:locale-changed';
  locale: AppLocale;
}

export function isMfeLocaleChangedMessage(value: unknown): value is MfeLocaleChangedMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return (
    message['type'] === 'debtflow:locale-changed' &&
    message['version'] === MFE_HOST_MESSAGE_VERSION &&
    message['source'] === 'platform' &&
    (message['locale'] === 'vi' || message['locale'] === 'en')
  );
}

export interface MfeOverlayStateMessage {
  source: string;
  version: typeof MFE_HOST_MESSAGE_VERSION;
  type: 'debtflow:overlay-state';
  overlayId: string;
  open: boolean;
}

export function isMfeOverlayStateMessage(value: unknown): value is MfeOverlayStateMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return (
    message['type'] === 'debtflow:overlay-state' &&
    message['version'] === MFE_HOST_MESSAGE_VERSION &&
    typeof message['source'] === 'string' &&
    typeof message['overlayId'] === 'string' &&
    typeof message['open'] === 'boolean'
  );
}
