import type {
  WindowMessageSubscriber,
  WindowMessageDispatcher,
  WindowMessengerOptions,
  PostWindowMessageOptions,
  ListenWindowMessagesOptions,
} from './messaging.types';
export type { WindowPeer, MessageValidator } from './messaging.types';

// Share subscriptions across SDK bundles without storing application data.
const dispatcherKey = Symbol.for('platform.window-messenger.v1');
function dispatcher() {
  const registry = window as Window & { [dispatcherKey]?: WindowMessageDispatcher };
  let hub = registry[dispatcherKey];
  if (hub) return hub;
  const subscribers = new Set<WindowMessageSubscriber>();
  const receive = (event: MessageEvent) => {
    for (const subscriber of [...subscribers]) {
      try {
        subscriber(event);
      } catch (error) {
        queueMicrotask(() => {
          throw error;
        });
      }
    }
  };
  hub = {
    subscribe(subscriber) {
      if (!subscribers.size) window.addEventListener('message', receive);
      subscribers.add(subscriber);
      return () => {
        if (!subscribers.delete(subscriber)) return;
        if (!subscribers.size) window.removeEventListener('message', receive);
      };
    },
  };
  Object.defineProperty(registry, dispatcherKey, { value: hub });
  return hub;
}

/** Framework-neutral, lazy transport. Safe to instantiate during SSR. */
export function createWindowMessenger<Message>(options: WindowMessengerOptions<Message>) {
  return {
    /** The only native postMessage call in the platform SDK/app integration. */
    post({ message }: PostWindowMessageOptions<Message>) {
      if (!options.validate(message)) throw new TypeError('Invalid platform message');
      const peer = options.getPeer();
      if (!peer) return false;
      peer.target.postMessage(message, peer.origin);
      return true;
    },
    listen({ handler, matches }: ListenWindowMessagesOptions<Message>) {
      return dispatcher().subscribe((event) => {
        const peer = options.getPeer();
        if (
          !peer ||
          event.source !== peer.target ||
          event.origin !== peer.origin ||
          !options.validate(event.data)
        )
          return;
        if (!matches || matches(event.data)) handler(event.data);
      });
    },
  };
}
