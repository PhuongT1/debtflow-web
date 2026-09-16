'use client';

const MESSAGE_VERSION = 1;

/**
 * Requests navigation through the Platform when Partner Ops is composed.
 * When the app runs standalone, it opens the configured Platform origin instead.
 */
export function isEmbeddedInPlatform() {
  return typeof window !== 'undefined' && window.parent !== window;
}

export function navigateToPlatform(path: string) {
  if (!path.startsWith('/')) return;

  if (isEmbeddedInPlatform()) {
    window.parent.postMessage(
      {
        source: 'partner-ops',
        version: MESSAGE_VERSION,
        type: 'debtflow:navigate',
        path,
      },
      window.location.origin,
    );
    return;
  }

  const platformOrigin = document.body.dataset.platformOrigin ?? window.location.origin;
  window.location.assign(new URL(path, platformOrigin).toString());
}
