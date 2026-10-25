import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, writeFile, rm, mkdir, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { buildDocs, normalizeBase } from './build.mjs';
import { documentRoute, routeIndex, aliasRouteIndex } from './routes.mjs';
import { createPreviewServer } from './preview.mjs';
import { exportRules } from '../rules-kit/export.mjs';

test('clean routes preserve source hierarchy and reject collisions', () => {
  assert.equal(
    documentRoute('docs/ai-guide/rule-reference/README.md'),
    '/ai-guide/rule-reference/',
  );
  assert.equal(
    documentRoute('.ai-rules/core/workflows/ui/verify.md'),
    '/rules/core/workflows/ui/verify/',
  );
  assert.equal(documentRoute('docs/README.md', '/handbook/'), '/handbook/documentation/');
  assert.throws(
    () => routeIndex([{ path: 'docs/a.md' }, { path: 'docs/a/README.md' }]),
    /Duplicate/,
  );
  assert.throws(() => normalizeBase('/../private/'), /Base must/);
});

test('static output serves deep links, raw Markdown and assets under a base without APIs', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'docs-static-'));
  let server;
  try {
    const output = join(temporary, 'dist');
    const result = await buildDocs({ output, base: '/handbook/' });
    assert.ok(result.pages > 100);
    await buildDocs({ output, base: '/handbook/' }); // Rebuilding an owned output is supported.
    server = createPreviewServer({ output, base: '/handbook/' });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    const html = await (await fetch(origin + '/handbook/ai-guide/rule-reference/')).text();
    assert.match(html, /docs-mode" content="static/);
    assert.match(html, /src="\/handbook\/viewer.js"/);
    assert.equal((await fetch(origin + '/handbook/viewer.js')).status, 200);
    assert.equal((await fetch(origin + '/handbook/styles/base.css')).status, 200);
    assert.match(
      await (await fetch(origin + '/handbook/raw/.ai-rules/README.md')).text(),
      /^# Engineering Rules/,
    );
    const docs = await (await fetch(origin + '/handbook/data/documents.json')).json();
    assert.ok(
      docs.some((page) => page.path === '.ai-rules/core/execution/flow.md' && page.diagram),
    );
    assert.ok(docs.every((page) => !page.path.startsWith('docs/plans/')));
    for (const page of docs) {
      assert.equal(page.text, await readFile(resolve(page.path), 'utf8'), page.path);
      const raw = await fetch(origin + '/handbook/raw/' + page.path);
      assert.equal(raw.status, 200, page.path);
      assert.equal(await raw.text(), page.text, page.path);
    }
    const aliases = aliasRouteIndex(docs, '/handbook/');
    assert.equal(
      aliases.get('/handbook/rules/workflows/ui/verify/'),
      '.ai-rules/core/workflows/ui/verify.md',
    );
    assert.match(
      await (await fetch(origin + '/handbook/rules/workflows/ui/verify/')).text(),
      /docs-mode/,
    );
    assert.ok(
      !docs.some((page) =>
        /^\.ai-rules\/(workflows|execution|standards|frameworks|concerns)\//.test(page.path),
      ),
    );
    assert.equal((await fetch(origin + '/handbook/api/pages')).status, 404);
    assert.equal((await fetch(origin + '/handbook/package.json')).status, 404);
    const unrelated = join(temporary, 'unrelated');
    await mkdir(unrelated);
    await writeFile(join(unrelated, 'keep.txt'), 'preserve');
    await assert.rejects(buildDocs({ output: unrelated }), /marker/);
    assert.equal(await readFile(join(unrelated, 'keep.txt'), 'utf8'), 'preserve');
    await assert.rejects(buildDocs({ output: resolve('docs/generated') }), /source folders/);
    await symlink(resolve('docs'), join(temporary, 'source-alias'));
    await assert.rejects(
      buildDocs({ output: join(temporary, 'source-alias/generated') }),
      /source folders/,
    );
  } finally {
    if (server?.listening) {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
    await rm(temporary, { recursive: true, force: true });
  }
});

test('exported viewer builds in isolated React, Next.js and Angular project fixtures without dependencies', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'docs-adoption-'));
  try {
    const projects = [
      {
        framework: 'react',
        profile:
          'JavaScript; Vite single app; src/widgets; CSS Modules; native controlled forms; no i18n or shared packages. Checks use npm scripts.',
        packageManager: 'npm@10.0.0',
      },
      {
        framework: 'nextjs',
        profile:
          'TypeScript; Pages Router; components by feature; styled-components; existing Formik forms; no microfrontend. Checks use pnpm scripts.',
        packageManager: 'pnpm@9.0.0',
      },
      {
        framework: 'angular',
        profile:
          'TypeScript; NgModule architecture; feature modules; component SCSS; reactive forms; no React or shared UI package. Checks use yarn scripts.',
        packageManager: 'yarn@1.22.22',
      },
    ];
    for (const { framework, profile, packageManager } of projects) {
      const root = await exportRules(join(temporary, framework), { withViewer: true });
      const manifest = JSON.stringify({
        name: framework + '-fixture',
        private: true,
        packageManager,
      });
      await writeFile(join(root, 'package.json'), manifest);
      const projectProfile = '# Project Profile\n\n' + profile + '\n';
      await writeFile(join(root, '.ai-rules/project/README.md'), projectProfile);
      const { execFile } = await import('node:child_process');
      const { promisify } = await import('node:util');
      await promisify(execFile)(process.execPath, ['tooling/rules-viewer/build.mjs'], {
        cwd: root,
      });
      const data = JSON.parse(await readFile(join(root, 'dist/docs/data/documents.json'), 'utf8'));
      assert.ok(data.length > 50);
      assert.ok(data.every((page) => !/debtflow|@debtflow/i.test(page.text)));
      assert.ok(
        data.every((page) => page.path === 'AGENTS.md' || page.path.startsWith('.ai-rules/')),
      );
      assert.equal(
        data.find((page) => page.path === '.ai-rules/project/README.md').text,
        projectProfile,
      );
      assert.equal(await readFile(join(root, 'package.json'), 'utf8'), manifest);
      assert.equal(
        await readFile(join(root, '.ai-rules/project/README.md'), 'utf8'),
        projectProfile,
      );
      assert.match(await readFile(join(root, 'dist/docs/rules/index.html'), 'utf8'), /docs-mode/);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
