"use client";

import { useEffect, useRef, useState } from "react";
import { MFE_HOST_MESSAGE_VERSION } from "@debtflow/contracts";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

type RemoteRuntimeManifest = {
  schemaVersion: 1;
  name: string;
  version: string;
  element: string;
  scripts: string[];
  styles: string[];
};

type HostState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

const scriptLoads = new Map<string, Promise<void>>();

function remoteAssetUrl(remoteOrigin: string, asset: string) {
  const base = remoteOrigin.endsWith("/") ? remoteOrigin : remoteOrigin + "/";
  return new URL(asset.replace(/^\//, ""), base).toString();
}

function loadModuleScript(url: string) {
  const existing = scriptLoads.get(url);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const prior = document.querySelector<HTMLScriptElement>(
      `script[data-debtflow-remote="${url}"]`,
    );
    if (prior?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = prior ?? document.createElement("script");
    script.type = "module";
    script.src = url;
    script.dataset.debtflowRemote = url;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error(`Cannot load ${url}`)),
      {
        once: true,
      },
    );
    if (!prior) document.head.appendChild(script);
  });

  scriptLoads.set(url, promise);
  void promise.catch(() => {
    scriptLoads.delete(url);
    document
      .querySelector<HTMLScriptElement>(`script[data-debtflow-remote="${url}"]`)
      ?.remove();
  });
  return promise;
}

function LoadingState({ label }: { label: string }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        justifyContent: "center",
        minHeight: 320,
      }}
    >
      <CircularProgress size={28} />
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
    </Box>
  );
}

function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <Alert
      action={
        <Button color="inherit" onClick={retry} size="small">
          Thử lại
        </Button>
      }
      severity="error"
    >
      {message}
    </Alert>
  );
}

export function WebComponentHost({
  appName,
  expectedElement,
  expectedVersion,
  manifestPath,
  remoteOrigin,
}: {
  appName: string;
  expectedElement: string;
  expectedVersion: string;
  manifestPath: string;
  remoteOrigin: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<HostState>({ status: "loading" });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let cancelled = false;
    let element: HTMLElement | undefined;

    async function mount() {
      setState({ status: "loading" });
      try {
        const response = await fetch(
          remoteAssetUrl(remoteOrigin, manifestPath),
          {
            cache: "no-store",
            credentials: "same-origin",
          },
        );
        if (!response.ok)
          throw new Error(`Runtime manifest returned HTTP ${response.status}.`);

        const manifest = (await response.json()) as RemoteRuntimeManifest;
        if (
          manifest.schemaVersion !== 1 ||
          manifest.name !== appName ||
          manifest.version !== expectedVersion ||
          manifest.element !== expectedElement
        ) {
          throw new Error(
            "Remote manifest is incompatible with the Platform contract.",
          );
        }
        if (!manifest.scripts.length)
          throw new Error("Remote manifest has no entry script.");

        for (const stylesheet of manifest.styles) {
          const href = remoteAssetUrl(remoteOrigin, stylesheet);
          if (!document.querySelector(`link[data-debtflow-remote="${href}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            link.dataset.debtflowRemote = href;
            document.head.appendChild(link);
          }
        }

        await Promise.all(
          manifest.scripts.map((script) =>
            loadModuleScript(remoteAssetUrl(remoteOrigin, script)),
          ),
        );
        await Promise.race([
          customElements.whenDefined(expectedElement),
          new Promise((_, reject) =>
            window.setTimeout(
              () => reject(new Error("Remote registration timed out.")),
              10_000,
            ),
          ),
        ]);

        if (cancelled) return;
        element = document.createElement(expectedElement);
        element.setAttribute("data-host-version", "1");
        container.replaceChildren(element);
        setState({ status: "ready" });
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Cannot load remote application.",
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
  }, [
    appName,
    attempt,
    expectedElement,
    expectedVersion,
    manifestPath,
    remoteOrigin,
  ]);

  return (
    <Box sx={{ minHeight: 0, width: "100%" }}>
      {state.status === "loading" ? (
        <LoadingState label="Đang tải micro frontend…" />
      ) : null}
      {state.status === "error" ? (
        <ErrorState
          message={state.message}
          retry={() => setAttempt((value) => value + 1)}
        />
      ) : null}
      <Box
        ref={containerRef}
        sx={{ display: state.status === "ready" ? "block" : "none" }}
      />
    </Box>
  );
}

export function IframeHost({
  appName,
  src,
  title,
}: {
  appName: string;
  src: string;
  title: string;
}) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<HostState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    const timeout = window.setTimeout(() => {
      setState({
        status: "error",
        message: "Micro frontend did not report ready state in time.",
      });
    }, 10_000);

    function onMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow ||
        event.data?.source !== appName ||
        event.data?.version !== MFE_HOST_MESSAGE_VERSION
      )
        return;

      if (event.data.type === "debtflow:ready") {
        window.clearTimeout(timeout);
        setState({ status: "ready" });
        return;
      }

      if (
        event.data.type === "debtflow:navigate" &&
        typeof event.data.path === "string" &&
        event.data.path.startsWith("/")
      ) {
        router.push(event.data.path);
      }
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
    };
  }, [appName, attempt, router, src]);

  return (
    <Box
      sx={{
        minHeight: "calc(100dvh - 80px)",
        position: "relative",
        width: "100%",
      }}
    >
      {state.status === "loading" ? (
        <LoadingState label="Đang tải micro frontend…" />
      ) : null}
      {state.status === "error" ? (
        <ErrorState
          message={state.message}
          retry={() => setAttempt((value) => value + 1)}
        />
      ) : null}
      <Box
        component="iframe"
        key={attempt}
        onError={() =>
          setState({
            status: "error",
            message: "Không thể tải micro frontend.",
          })
        }
        ref={iframeRef}
        src={src}
        title={title}
        sx={{
          border: 0,
          display: state.status === "ready" ? "block" : "none",
          height: "calc(100dvh - 80px)",
          width: "100%",
        }}
      />
    </Box>
  );
}
