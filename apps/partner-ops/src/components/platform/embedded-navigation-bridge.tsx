'use client';

import { useEffect } from 'react';
import { isMfeLocaleChangedMessage } from '@debtflow/contracts';
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

    // Next.js owns history for in-app state such as list filters and pagination.
    // Only explicit anchor navigation is forwarded to the Shell.

    const onMessage = (event: MessageEvent) => {
      if (
        event.source === window.parent &&
        event.origin === window.location.origin &&
        isMfeLocaleChangedMessage(event.data)
      ) {
        setStoredLocale(event.data.locale);
      }
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('message', onMessage);
    window.parent.postMessage(
      {
        source: 'partner-ops',
        version: MESSAGE_VERSION,
        type: 'debtflow:ready',
      },
      window.location.origin,
    );

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return null;
}
