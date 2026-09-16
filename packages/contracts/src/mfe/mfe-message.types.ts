/**
 * Stable browser contract between the Platform host and an iframe remote.
 * Keep this framework-neutral: Angular, React, Vue, etc. can emit the same
 * postMessage payload without importing host implementation details.
 */
export const MFE_HOST_MESSAGE_VERSION = 1 as const;

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
