/** Framework-neutral wire contract. Remote code never supplies a URL or executable UI. */
export const OVERLAY_PROTOCOL = 'platform-overlay-v1' as const;
export type OverlaySize = 'xs' | 'sm' | 'md' | 'lg';
export type OverlayResult = {
  status: 'completed' | 'cancelled' | 'failed';
  message?: string;
  data?: Record<string, unknown>;
};
export type OverlayRequest = {
  view: string;
  title: string;
  size?: OverlaySize;
  input?: Record<string, unknown>;
};
export type OverlayMessage = {
  protocol: typeof OVERLAY_PROTOCOL;
  id: string;
  type:
    | 'open'
    | 'accepted'
    | 'ready'
    | 'init'
    | 'close-request'
    | 'result'
    | 'abort'
    | 'resize'
    | 'presented'
    | 'activate';
  request?: OverlayRequest;
  result?: OverlayResult;
  locale?: 'en' | 'vi';
  height?: number;
};
export function isOverlayMessage(value: unknown): value is OverlayMessage {
  if (!value || typeof value !== 'object') return false;
  const m = value as Record<string, unknown>;
  if (
    m['protocol'] !== OVERLAY_PROTOCOL ||
    typeof m['id'] !== 'string' ||
    !/^[a-zA-Z0-9-]{1,100}$/.test(m['id'])
  )
    return false;
  if (
    ![
      'open',
      'accepted',
      'ready',
      'init',
      'close-request',
      'result',
      'abort',
      'resize',
      'presented',
      'activate',
    ].includes(String(m['type']))
  )
    return false;
  if (m['locale'] !== undefined && m['locale'] !== 'en' && m['locale'] !== 'vi') return false;
  const result = m['result'] as OverlayResult | undefined;
  if (
    result?.message !== undefined &&
    (typeof result.message !== 'string' || result.message.length > 500)
  )
    return false;
  if (
    (m['type'] === 'resize' || m['type'] === 'presented') &&
    (typeof m['height'] !== 'number' ||
      !Number.isFinite(m['height']) ||
      m['height'] < 0 ||
      m['height'] > 50000)
  )
    return false;
  if (result?.data !== undefined && !isOverlayData(result.data)) return false;
  if (m['type'] === 'open' || m['type'] === 'init') {
    const r = m['request'] as OverlayRequest | undefined;
    if (
      !r ||
      typeof r.view !== 'string' ||
      !/^[a-z][a-z0-9.-]{0,79}$/.test(r.view) ||
      typeof r.title !== 'string' ||
      r.title.length > 300 ||
      !r.title.trim()
    )
      return false;
    if (r.size !== undefined && !['xs', 'sm', 'md', 'lg'].includes(r.size)) return false;
    if (r.input !== undefined && !isOverlayData(r.input)) return false;
    try {
      if (JSON.stringify(r).length > 16000) return false;
    } catch {
      return false;
    }
  }
  if (
    m['type'] === 'result' &&
    !['completed', 'cancelled', 'failed'].includes(
      String((m['result'] as OverlayResult | undefined)?.status),
    )
  )
    return false;
  return true;
}

/** JSON-safe metadata; excludes callbacks, DOM nodes, cycles and oversized payloads. */
function isOverlayData(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  try {
    const seen = new WeakSet<object>();
    const visit = (item: unknown, depth: number): boolean => {
      if (depth > 20) return false;
      if (item === null || typeof item === 'string' || typeof item === 'boolean') return true;
      if (typeof item === 'number') return Number.isFinite(item);
      if (!item || typeof item !== 'object' || seen.has(item)) return false;
      const prototype = Object.getPrototypeOf(item);
      if (!Array.isArray(item) && prototype !== Object.prototype && prototype !== null)
        return false;
      seen.add(item);
      const valid = Object.values(item).every((child) => visit(child, depth + 1));
      seen.delete(item);
      return valid;
    };
    return visit(value, 0) && JSON.stringify(value).length <= 16000;
  } catch {
    return false;
  }
}
