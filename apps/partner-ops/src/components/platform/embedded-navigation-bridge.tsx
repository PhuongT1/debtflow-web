'use client';

import { useEffect } from 'react';
import {
  isMfeLocaleChangedMessage,
  isMfeRouteChangedMessage,
  MFE_ROUTE_SYNC_CAPABILITY,
} from '@debtflow/contracts';
import { useRouter } from 'next/navigation';
import { setStoredLocale } from '@debtflow/platform-sdk';

const MESSAGE_VERSION = 1;

function shellPath(value: string | URL | null | undefined) {
  if (!value) return null;
  const target = new URL(String(value), window.location.href);
  if (target.origin !== window.location.origin) return null;
  if (!target.pathname.startsWith('/')) return null;
  return target.pathname + target.search + target.hash;
}

export function EmbeddedNavigationBridge() {
  const router = useRouter();
  useEffect(() => {
    const postNavigation = (path: string) => {
      window.parent.postMessage(
        {
          source: 'partner-ops',
          version: MESSAGE_VERSION,
          type: 'debtflow:navigate',
          path,
        },
        window.location.origin,
      );
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const path = shellPath(anchor.href);
      if (!path) return;

      event.preventDefault();
      event.stopPropagation();
      postNavigation(path);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || event.origin !== window.location.origin) return;
      if (isMfeLocaleChangedMessage(event.data)) {
        setStoredLocale(event.data.locale);
      }
      if (isMfeRouteChangedMessage(event.data)) {
        const target = new URL(event.data.path, window.location.origin);
        const embedEntry = '/__embed/parties';
        const entryIndex = window.location.pathname.indexOf(embedEntry);
        if (entryIndex < 0) return;
        const base = window.location.pathname.slice(0, entryIndex) + embedEntry;
        if (target.pathname !== base && !target.pathname.startsWith(base + '/')) return;
        const path = target.pathname + target.search + target.hash;
        if (path === window.location.pathname + window.location.search + window.location.hash)
          return;
        if (target.pathname === window.location.pathname) {
          // Next integrates native history with useSearchParams. Query state is
          // fetched by the feature's Query layer; no RSC or document reload.
          window.history.replaceState(null, '', path);
        } else {
          // Keep RSC requests on the remote proxy, never the Shell's /parties.
          // Only the host creates browser history entries.
          router.replace(path, { scroll: false });
        }
      }
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('message', onMessage);
    window.parent.postMessage(
      {
        source: 'partner-ops',
        version: MESSAGE_VERSION,
        type: 'debtflow:ready',
        capabilities: [MFE_ROUTE_SYNC_CAPABILITY],
      },
      window.location.origin,
    );

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('message', onMessage);
    };
  }, [router]);

  return null;
}
