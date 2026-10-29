'use client';
import { useEffect } from 'react';
import { MFE_ROUTE_SYNC_CAPABILITY } from '@packages/platform-contracts';
import { useRouter } from 'next/navigation';
import { setStoredLocale } from '@packages/platform-sdk';
import { partnerPlatform } from '@/lib/platform/client';

function shellPath(value: string) {
  const target = new URL(value, window.location.href);
  return target.origin === window.location.origin
    ? target.pathname + target.search + target.hash
    : null;
}

/** Embedded composition root: this is where Partner Ops registers its host
 * callbacks. The SDK dispatcher listens to the browser; this component applies
 * navigation/locale to Next.js. Standalone layout never mounts this bridge. */
export function EmbeddedPlatformBridge() {
  const router = useRouter();
  useEffect(() => {
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
      partnerPlatform.navigate({ path });
    };
    // Subscribe before ready so the first host reply cannot be missed.
    const unsubscribe = partnerPlatform.listen({
      onLocale: ({ locale }) => setStoredLocale(locale),
      onRoute: ({ path }) => {
        const target = new URL(path, window.location.origin);
        const embedEntry = '/__embed/parties';
        const entryIndex = window.location.pathname.indexOf(embedEntry);
        if (entryIndex < 0) return;
        const base = window.location.pathname.slice(0, entryIndex) + embedEntry;
        if (target.pathname !== base && !target.pathname.startsWith(base + '/')) return;
        const next = target.pathname + target.search + target.hash;
        if (next === window.location.pathname + window.location.search + window.location.hash)
          return;
        // Shell owns public history. Query changes retain this iframe and cache;
        // pathname changes use the remote router so RSC stays on its proxy.
        if (target.pathname === window.location.pathname)
          window.history.replaceState(null, '', next);
        else router.replace(next, { scroll: false });
      },
    });
    document.addEventListener('click', onClick, true);
    partnerPlatform.announceReady({ capabilities: [MFE_ROUTE_SYNC_CAPABILITY] });
    return () => {
      document.removeEventListener('click', onClick, true);
      unsubscribe();
    };
  }, [router]);
  return null;
}
