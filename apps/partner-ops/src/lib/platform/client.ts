'use client';
import { createPlatformClient } from '@packages/platform-sdk';

/** Share one integration client across navigation, locale synchronization and overlay requests. */
export const partnerPlatform = createPlatformClient({
  source: 'partner-ops',
  getHostOrigin: () => document.body.dataset.platformOrigin ?? window.location.origin,
});
