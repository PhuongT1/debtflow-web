import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const checker = fileURLToPath(new URL('./check-frontend-boundaries.mjs', import.meta.url));
async function fixture(run) {
  const root = await mkdtemp(path.join(tmpdir(), 'package-boundaries-'));
  const write = async (file, source) => {
    const target = path.join(root, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, source);
  };
  await mkdir(path.join(root, 'apps'));
  await write(
    'packages/ui/react/package.json',
    JSON.stringify({ name: '@packages/ui-react', dependencies: { next: '*' } }),
  );
  await write(
    'packages/ui/react/src/adapters/next/index.ts',
    "export { useRouter } from 'next/navigation';",
  );
  await write('packages/ui/react/src/index.ts', 'export const version = 1;');
  await write(
    'packages/platform/contracts/package.json',
    JSON.stringify({ name: '@packages/platform-contracts' }),
  );
  await write('packages/platform/contracts/src/index.ts', 'export type Identifier = string;');
  const check = () =>
    execFileSync(process.execPath, [checker], { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  try {
    await run({ write, check });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
function rejects(check, pattern) {
  assert.throws(check, (error) => pattern.test(String(error.stderr)));
}

test('discovers nested packages and permits Next imports in the explicit adapter', async () => {
  await fixture(async ({ check }) => assert.match(check(), /valid across 2 workspaces/));
});
test('rejects a public package name that disagrees with its directory', async () => {
  await fixture(async ({ write, check }) => {
    await write(
      'packages/ui/react/package.json',
      JSON.stringify({ name: '@packages/other', dependencies: { next: '*' } }),
    );
    rejects(check, /must match packages/);
  });
});
test('reserves the shared-package namespace against app-local aliases', async () => {
  await fixture(async ({ write, check }) => {
    await write('apps/demo/package.json', JSON.stringify({ name: '@app/demo' }));
    await write(
      'apps/demo/tsconfig.json',
      JSON.stringify({ compilerOptions: { paths: { '@packages/*': ['./src/*'] } } }),
    );
    rejects(check, /reserved workspace package scope @packages\//);
  });
});
test('rejects a Next dependency inside generic React implementation', async () => {
  await fixture(async ({ write, check }) => {
    await write('packages/ui/react/src/index.ts', "export { useRouter } from 'next/navigation';");
    rejects(check, /must keep Next.js imports in adapters/);
  });
});
test('allows an intentional named facade for Next adapters', async () => {
  await fixture(async ({ write, check }) => {
    await write('packages/ui/react/src/index.ts', "export { useRouter } from './adapters/next';");
    assert.match(check(), /valid across 2 workspaces/);
  });
});
test('rejects exposing Next adapters through a wildcard facade', async () => {
  await fixture(async ({ write, check }) => {
    await write('packages/ui/react/src/index.ts', "export * from './adapters/next';");
    rejects(check, /only through named package-facade exports/);
  });
});
test('rejects importing a Next adapter into an ordinary React component', async () => {
  await fixture(async ({ write, check }) => {
    await write(
      'packages/ui/react/src/widget.ts',
      "import { useRouter } from './adapters/next'; export const widget = useRouter;",
    );
    rejects(check, /only through named package-facade exports/);
  });
});
