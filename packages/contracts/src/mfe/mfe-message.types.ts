/**
 * Stable browser contract between the Platform host and an iframe remote.
 * Keep this framework-neutral: Angular, React, Vue, etc. can emit the same
 * postMessage payload without importing host implementation details.
 */
export const MFE_HOST_MESSAGE_VERSION = 1 as const;

export interface MfeOverlayStateMessage {
  source: string;
  version: typeof MFE_HOST_MESSAGE_VERSION;
  type: "debtflow:overlay-state";
  overlayId: string;
  open: boolean;
}

export function isMfeOverlayStateMessage(
  value: unknown,
): value is MfeOverlayStateMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    message["type"] === "debtflow:overlay-state" &&
    message["version"] === MFE_HOST_MESSAGE_VERSION &&
    typeof message["source"] === "string" &&
    typeof message["overlayId"] === "string" &&
    typeof message["open"] === "boolean"
  );
}
