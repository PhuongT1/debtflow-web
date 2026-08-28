"use client";

import { useEffect } from "react";

const MESSAGE_VERSION = 1;

function shellPath(value: string | URL | null | undefined) {
  if (!value) return null;
  const target = new URL(String(value), window.location.href);
  if (target.origin !== window.location.origin) return null;
  if (!target.pathname.startsWith("/")) return null;
  return target.pathname + target.search + target.hash;
}

export function EmbeddedNavigationBridge() {
  useEffect(() => {
    const postNavigation = (path: string) => {
      window.parent.postMessage(
        {
          source: "partner-ops",
          version: MESSAGE_VERSION,
          type: "debtflow:navigate",
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

      const anchor = (
        event.target as Element | null
      )?.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const path = shellPath(anchor.href);
      if (!path) return;

      event.preventDefault();
      event.stopPropagation();
      postNavigation(path);
    };

    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(
      window.history,
    );

    window.history.pushState = (data, unused, url) => {
      const path = shellPath(url);
      if (path) postNavigation(path);
      else originalPushState(data, unused, url);
    };
    window.history.replaceState = (data, unused, url) => {
      const path = shellPath(url);
      if (path) postNavigation(path);
      else originalReplaceState(data, unused, url);
    };

    document.addEventListener("click", onClick, true);
    window.parent.postMessage(
      {
        source: "partner-ops",
        version: MESSAGE_VERSION,
        type: "debtflow:ready",
      },
      window.location.origin,
    );

    return () => {
      document.removeEventListener("click", onClick, true);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return null;
}
