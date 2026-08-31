import { DEBTFLOW_EVENT_VERSION, type DebtflowEventMap } from "./event-map.types";

export function publishPlatformEvent<K extends keyof DebtflowEventMap>(
  name: K,
  detail: DebtflowEventMap[K],
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(`debtflow:v${DEBTFLOW_EVENT_VERSION}:${name}`, { detail }),
  );
}

export function subscribePlatformEvent<K extends keyof DebtflowEventMap>(
  name: K,
  listener: (detail: DebtflowEventMap[K]) => void,
) {
  if (typeof window === "undefined") return () => undefined;
  const eventName = `debtflow:v${DEBTFLOW_EVENT_VERSION}:${name}`;
  const handler = (event: Event) =>
    listener((event as CustomEvent<DebtflowEventMap[K]>).detail);
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}
