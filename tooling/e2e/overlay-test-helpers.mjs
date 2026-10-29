import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const compile = (source) =>
  ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
const dataUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const sdkRoot = new URL('../../packages/platform/sdk/src/', import.meta.url);
const contractRoot = new URL('../../packages/platform/contracts/src/mfe/', import.meta.url);
const contractUrl = dataUrl(
  (
    await Promise.all(
      ['overlay.types.ts', 'mfe-message.types.ts'].map(async (file) =>
        compile(await readFile(new URL(file, contractRoot), 'utf8')),
      ),
    )
  ).join('\n'),
);
export const contract = await import(contractUrl);
const cache = new Map();
async function moduleUrl(url) {
  if (cache.has(url.href)) return cache.get(url.href);
  const pending = (async () => {
    let source = compile(await readFile(url, 'utf8'));
    const imports = [...source.matchAll(/from ['"]([^'"]+)['"]/g)].map((match) => match[1]);
    for (const specifier of new Set(imports)) {
      const target =
        specifier === '@packages/platform-contracts'
          ? contractUrl
          : await moduleUrl(new URL(specifier + '.ts', url));
      source = source
        .replaceAll(`from '${specifier}'`, `from '${target}'`)
        .replaceAll(`from "${specifier}"`, `from "${target}"`);
    }
    return dataUrl(source);
  })();
  cache.set(url.href, pending);
  return pending;
}
export async function loadSdk(file) {
  return import(await moduleUrl(new URL(`overlays/${file}.ts`, sdkRoot)));
}
export async function loadMessaging(file) {
  return import(await moduleUrl(new URL(`messaging/${file}.ts`, sdkRoot)));
}
export function fakeWindow() {
  const listeners = new Set();
  const timers = new Map();
  const sent = [];
  const parent = { postMessage: (message, origin) => sent.push({ message, origin }) };
  return {
    parent,
    sent,
    listeners,
    timers,
    addEventListener: (_type, fn) => listeners.add(fn),
    removeEventListener: (_type, fn) => listeners.delete(fn),
    setTimeout: (fn) => {
      const id = timers.size + 1;
      timers.set(id, fn);
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    receive(message, origin = 'https://host.test', source = parent) {
      for (const fn of [...listeners]) fn({ data: message, origin, source });
    },
  };
}

export async function loadMessengerCopy() {
  const source = compile(await readFile(new URL('messaging/window-messenger.ts', sdkRoot), 'utf8'));
  return import(dataUrl(source + '\n// Independently bundled SDK copy'));
}
