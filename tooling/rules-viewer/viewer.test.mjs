import assert from 'node:assert/strict';
import { mkdtemp, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { after, before, test } from 'node:test';
import { createViewerServer, documentPayload } from './server.mjs';
import { parseDiagram, layoutDiagram } from './diagram.mjs';

let server;
let origin;
before(async () => {
  server = createViewerServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (!server?.listening) return;
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

test('every canonical diagram has linked, finite, non-overlapping nodes', async () => {
  const catalog = await (await fetch(`${origin}/api/catalog`)).json();
  assert.ok(catalog.some((item) => item.path.includes('bug-fix/ui/flow.md')));
  assert.ok(catalog.some((item) => item.path.includes('bug-fix/non-ui/flow.md')));
  assert.ok(catalog.some((item) => item.path.includes('component/create/flow.md')));
  assert.ok(catalog.some((item) => item.path.includes('component/modify/flow.md')));
  for (const item of catalog) {
    const response = await fetch(`${origin}/api/document?path=${encodeURIComponent(item.path)}`);
    assert.equal(response.status, 200, item.path);
    const document = await response.json();
    const graph = parseDiagram(document.text);
    const layout = layoutDiagram(graph);
    assert.ok(
      layout.nodes.every((node) => node.href && Number.isFinite(node.x) && Number.isFinite(node.y)),
      item.path,
    );
    assert.equal(
      new Set(layout.nodes.map((node) => `${node.x}:${node.y}`)).size,
      layout.nodes.length,
    );
    assert.ok(layout.width > 0 && layout.height > 0);
  }
});

test('serves rules Markdown and known assets, never files outside its read boundary', async () => {
  assert.equal((await fetch(`${origin}/`)).status, 200);
  assert.equal((await fetch(`${origin}/ai-guide/rule-reference/`)).status, 200);
  const clean = await fetch(`${origin}/ai-guide/rule-reference`, { redirect: 'manual' });
  assert.equal(clean.status, 308);
  assert.equal(clean.headers.get('location'), '/ai-guide/rule-reference/');
  assert.equal(
    (await fetch(`${origin}/?doc=docs%2Fai-guide%2Frule-reference%2FREADME.md`)).status,
    200,
  );
  assert.equal((await fetch(`${origin}/api/document?path=.ai-rules%2FREADME.md`)).status, 200);
  for (const path of [
    '.ai-rules/../README.md',
    '.ai-rules/../package.json',
    '/etc/passwd',
    '.ai-rules/../.env',
  ]) {
    const response = await fetch(`${origin}/api/document?path=${encodeURIComponent(path)}`);
    assert.equal(response.status, 400, path);
    assert.deepEqual(await response.json(), {
      error: 'Unavailable document or path outside approved documentation',
    });
  }
  assert.equal((await fetch(`${origin}/package.json`)).status, 404);
  assert.equal((await fetch(`${origin}/api/document`, { method: 'POST' })).status, 405);
});

test('rejects unknown graph syntax and references instead of silently drawing incorrect steps', () => {
  assert.throws(() => parseDiagram('```mermaid\nflowchart TD\nA --> MISSING\n```'), /Undefined/);
  assert.throws(() => parseDiagram('```mermaid\nflowchart TD\nA -.-> B\n```'), /Unsupported/);
});

test('lists all Markdown pages and finds nested rules by content and path', async () => {
  const pages = await (await fetch(`${origin}/api/pages`)).json();
  assert.ok(pages.length > 30);
  assert.ok(pages.some((page) => page.path === '.ai-rules/README.md'));
  assert.ok(
    pages.some((page) => page.path === '.ai-rules/core/frameworks/react/components/props.md'),
  );
  assert.ok(pages.every((page) => !('text' in page)));
  const matches = await (await fetch(`${origin}/api/search?q=approval`)).json();
  assert.ok(matches.some((page) => page.path === '.ai-rules/core/execution/approval.md'));
  assert.ok(matches.every((page) => typeof page.snippet === 'string'));
  assert.deepEqual(await (await fetch(`${origin}/api/search?q=`)).json(), []);
  const raw = await fetch(`${origin}/api/raw?path=.ai-rules%2FREADME.md`);
  assert.match(raw.headers.get('content-type'), /text\/plain/);
  assert.match(await raw.text(), /^# Engineering Rules/);
  assert.equal((await fetch(`${origin}/api/raw?path=.ai-rules%2F..%2FREADME.md`)).status, 400);
});

test('curated sections include onboarding, architecture, standards and AI without exposing plans', async () => {
  const pages = await (await fetch(`${origin}/api/pages`)).json();
  for (const [path, section] of [
    ['docs/getting-started/README.md', 'start'],
    ['docs/architecture/workspace.md', 'architecture'],
    ['docs/engineering/frameworks/nextjs/code-placement.md', 'standards'],
    ['docs/ai-guide/how-ai-works/README.md', 'ai'],
    ['.ai-rules/core/frameworks/nextjs/README.md', 'standards'],
    ['.ai-rules/core/workflows/bug-fix/ui/investigate.md', 'ai'],
    ['apps/partner-ops/.ai-rules/architecture.md', 'architecture'],
  ]) {
    assert.equal(pages.find((page) => page.path === path)?.section, section, path);
    assert.equal(
      (await fetch(`${origin}/api/document?path=${encodeURIComponent(path)}`)).status,
      200,
    );
  }
  assert.ok(pages.every((page) => !page.path.startsWith('docs/plans/')));
  const results = await (await fetch(`${origin}/api/search?q=workspace`)).json();
  assert.ok(results.some((item) => item.section === 'architecture'));
  assert.equal(
    (
      await fetch(
        `${origin}/api/document?path=docs/plans/engineering-documentation-architecture.md`,
      )
    ).status,
    400,
  );
});

test('unsupported Mermaid never prevents reading the original article', () => {
  const text = '# Architecture\n\n```mermaid\nflowchart TD\nclassDef node fill:red;\n```';
  const result = documentPayload('docs/architecture/README.md', text);
  assert.equal(result.text, text);
  assert.equal(result.diagram, null);
  assert.match(result.diagramWarning, /unsupported/);
});

test('all indexed documents have one section and symlinks cannot expose outside Markdown', async () => {
  const pages = await (await fetch(`${origin}/api/pages`)).json();
  assert.ok(
    pages.every((page) => ['start', 'architecture', 'standards', 'ai'].includes(page.section)),
  );
  const directory = await mkdtemp(join(tmpdir(), 'debtflow-docs-test-'));
  const link = resolve('docs/ai-guide', `.viewer-boundary-${process.pid}.md`);
  try {
    const privateFile = join(directory, 'private.md');
    await writeFile(privateFile, 'private fixture content');
    await symlink(privateFile, link);
    const response = await fetch(
      `${origin}/api/document?path=${encodeURIComponent(`docs/ai-guide/.viewer-boundary-${process.pid}.md`)}`,
    );
    assert.equal(response.status, 400);
    assert.ok(!(await response.text()).includes('private fixture content'));
    assert.ok(
      !(await (await fetch(`${origin}/api/pages`)).json()).some((page) =>
        page.path.endsWith(`.viewer-boundary-${process.pid}.md`),
      ),
    );
  } finally {
    await rm(link, { force: true });
    await rm(directory, { recursive: true, force: true });
  }
});

test('moved sources resolve old bookmarks without duplicate indexed pages', async () => {
  const { documentAliases } = await import('./aliases.mjs');
  const { sections, belongsToGroup } = await import('./sections.mjs');
  const pages = await (await fetch(`${origin}/api/pages`)).json();
  for (const [oldPath, newPath] of Object.entries(documentAliases)) {
    const result = await (
      await fetch(`${origin}/api/document?path=${encodeURIComponent(oldPath)}`)
    ).json();
    assert.equal(result.path, newPath);
    assert.ok(!pages.some((page) => page.path === oldPath));
    assert.equal(pages.filter((page) => page.path === newPath).length, 1);
  }
  const { documentRoute, aliasRouteIndex } = await import('./routes.mjs');
  for (const [route, newPath] of aliasRouteIndex(pages)) {
    const response = await fetch(origin + route + '?from=bookmark', { redirect: 'manual' });
    assert.equal(response.status, 308, route);
    assert.equal(response.headers.get('location'), documentRoute(newPath) + '?from=bookmark');
    assert.equal((await fetch(origin + documentRoute(newPath))).status, 200);
  }
  const core = pages.filter((page) => page.path.startsWith('.ai-rules/core/'));
  assert.ok(core.length > 90);
  assert.ok(
    !pages.some((page) =>
      /^\.ai-rules\/(execution|workflows|standards|frameworks|concerns)\//.test(page.path),
    ),
  );
  for (const page of pages) {
    assert.equal(
      sections
        .flatMap((section) => section.groups)
        .filter((group) => belongsToGroup(page.path, group)).length,
      1,
      page.path,
    );
  }
  const favicon = await fetch(`${origin}/favicon.svg`);
  assert.equal(favicon.status, 200);
  assert.match(favicon.headers.get('content-type'), /image\/svg\+xml/);
});

test('tab names match their Markdown home and primary folder', async () => {
  const { sections } = await import('./sections.mjs');
  const pages = await (await fetch(`${origin}/api/pages`)).json();
  for (const section of sections) {
    const home = pages.find((page) => page.path === section.home);
    assert.equal(home?.title, section.title, section.home);
    assert.ok(
      section.groups.some((group) => section.home === `${group.root}/README.md`),
      section.home,
    );
  }
  assert.equal(pages.find((page) => page.path === 'docs/README.md')?.section, 'start');
});
