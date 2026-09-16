'use client';

// Intentionally over 230 lines: manifest validation, remote asset loading, and
// custom-element lifecycle form one host boundary and must evolve together.
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { RemoteErrorState, RemoteLoadingState, type RemoteHostState } from './remote-host-state';
import { http } from '@/lib/api/http';

type RemoteRuntimeManifest = {
  schemaVersion: 1;
  name: string;
  version: string;
  element: string;
  scripts: string[];
  styles: string[];
};

const scriptLoads = new Map<string, Promise<void>>();

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isRemoteRuntimeManifest(value: unknown): value is RemoteRuntimeManifest {
  if (!isRecord(value)) return false;

  const manifest = value;
  return (
    manifest.schemaVersion === 1 &&
    typeof manifest.name === 'string' &&
    typeof manifest.version === 'string' &&
    typeof manifest.element === 'string' &&
    isStringArray(manifest.scripts) &&
    isStringArray(manifest.styles)
  );
}

function remoteAssetUrl(remoteOrigin: string, asset: string) {
  const base = remoteOrigin.endsWith('/') ? remoteOrigin : `${remoteOrigin}/`;
  return new URL(asset.replace(/^\//, ''), base).toString();
}

function loadModuleScript(url: string) {
  const existing = scriptLoads.get(url);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const prior = document.querySelector<HTMLScriptElement>(
      `script[data-debtflow-remote="${url}"]`,
    );
    if (prior?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const script = prior ?? document.createElement('script');
    script.type = 'module';
    script.src = url;
    script.dataset.debtflowRemote = url;
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true },
    );
    script.addEventListener('error', () => reject(new Error(`Cannot load ${url}`)), {
      once: true,
    });
    if (!prior) document.head.appendChild(script);
  });

  scriptLoads.set(url, promise);
  void promise.catch(() => {
    scriptLoads.delete(url);
    document.querySelector<HTMLScriptElement>(`script[data-debtflow-remote="${url}"]`)?.remove();
  });
  return promise;
}

type WebComponentHostProps = {
  appName: string;
  expectedElement: string;
  expectedVersion: string;
  manifestPath: string;
  remoteOrigin: string;
};

export function WebComponentHost({
  appName,
  expectedElement,
  expectedVersion,
  manifestPath,
  remoteOrigin,
}: WebComponentHostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RemoteHostState>({ status: 'loading' });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let cancelled = false;
    let element: HTMLElement | undefined;

    async function mount() {
      setState({ status: 'loading' });
      try {
        const response = await http.get(remoteAssetUrl(remoteOrigin, manifestPath), {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        if (!response.ok) {
          throw new Error(`Runtime manifest returned HTTP ${response.status}.`);
        }

        const payload: unknown = await response.json();
        if (!isRemoteRuntimeManifest(payload)) {
          throw new Error('Remote manifest has an invalid shape.');
        }

        const manifest = payload;
        if (
          manifest.name !== appName ||
          manifest.version !== expectedVersion ||
          manifest.element !== expectedElement
        ) {
          throw new Error('Remote manifest is incompatible with the Platform contract.');
        }
        if (!manifest.scripts.length) {
          throw new Error('Remote manifest has no entry script.');
        }

        for (const stylesheet of manifest.styles) {
          const href = remoteAssetUrl(remoteOrigin, stylesheet);
          if (!document.querySelector(`link[data-debtflow-remote="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.dataset.debtflowRemote = href;
            document.head.appendChild(link);
          }
        }

        await Promise.all(
          manifest.scripts.map((script) => loadModuleScript(remoteAssetUrl(remoteOrigin, script))),
        );
        await Promise.race([
          customElements.whenDefined(expectedElement),
          new Promise((_, reject) =>
            window.setTimeout(() => reject(new Error('Remote registration timed out.')), 10_000),
          ),
        ]);

        if (cancelled) return;
        element = document.createElement(expectedElement);
        element.setAttribute('data-host-version', '1');
        container.replaceChildren(element);
        setState({ status: 'ready' });
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Cannot load remote application.',
          });
        }
      }
    }

    void mount();
    return () => {
      cancelled = true;
      element?.remove();
      container.replaceChildren();
    };
  }, [appName, attempt, expectedElement, expectedVersion, manifestPath, remoteOrigin]);

  return (
    <Box sx={{ minHeight: 0, width: '100%' }}>
      {state.status === 'loading' ? <RemoteLoadingState label="Đang tải micro frontend…" /> : null}
      {state.status === 'error' ? (
        <RemoteErrorState message={state.message} retry={() => setAttempt((value) => value + 1)} />
      ) : null}
      <Box ref={containerRef} sx={{ display: state.status === 'ready' ? 'block' : 'none' }} />
    </Box>
  );
}
