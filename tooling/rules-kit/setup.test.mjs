import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportRules } from './export.mjs';
import { syncToolkit } from './setup.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { listDocuments } from '../rules-viewer/library.mjs';

const exec = promisify(execFile);

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
async function fixture(run) {
  const temporary = await mkdtemp(join(tmpdir(), 'toolkit-setup-'));
  try {
    await run(await exportRules(join(temporary, 'project')), temporary);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
async function addSkill(project, name = 'local-example') {
  const path = join(project, '.ai-rules/project/skills', name);
  await mkdir(path, { recursive: true });
  await writeFile(
    join(path, 'SKILL.md'),
    `---\nname: ${name}\ndescription: "Use for the local example task."\n---\n\n# Local Example\n\nFollow [project context](../../README.md).\n`,
  );
}

test('installed capabilities match their canonical sources', async () => {
  const result = await syncToolkit(root, { check: true });
  assert.ok(result.skills.length >= 8);
  assert.ok(result.agents.some((role) => role.access === 'read-only'));
});

test('adding and deleting a project skill updates all selected clients without touching core', async () => {
  await fixture(async (project) => {
    const before = await readFile(
      join(project, '.ai-rules/core/skills/engineering-bug-fix/SKILL.md'),
      'utf8',
    );
    await addSkill(project);
    await assert.rejects(syncToolkit(project, { check: true }), /stale/);
    await syncToolkit(project);
    for (const client of ['.agents', '.claude', '.cursor']) {
      const path = join(project, client, 'skills/local-example/SKILL.md');
      const text = await readFile(path, 'utf8');
      assert.match(text, /\.ai-rules\/project\/README.md/);
      const link = text.match(/\[project context\]\(([^)]+)\)/)[1];
      assert.equal(resolve(dirname(path), link), join(project, '.ai-rules/project/README.md'));
    }
    await rm(join(project, '.ai-rules/project/skills/local-example'), { recursive: true });
    await syncToolkit(project);
    for (const client of ['.agents', '.claude', '.cursor'])
      await assert.rejects(access(join(project, client, 'skills/local-example/SKILL.md')), {
        code: 'ENOENT',
      });
    assert.equal(
      await readFile(join(project, '.ai-rules/core/skills/engineering-bug-fix/SKILL.md'), 'utf8'),
      before,
    );
  });
});

test('modified projections block regeneration before any other output is changed', async () => {
  await fixture(async (project) => {
    const path = join(project, '.claude/skills/engineering-bug-fix/SKILL.md');
    await writeFile(path, 'user changes\n');
    const catalog = await readFile(join(project, '.ai-rules/CATALOG.md'), 'utf8');
    await addSkill(project);
    await assert.rejects(syncToolkit(project), /hand-edited or unowned/);
    assert.equal(await readFile(path, 'utf8'), 'user changes\n');
    assert.equal(await readFile(join(project, '.ai-rules/CATALOG.md'), 'utf8'), catalog);
    await assert.rejects(access(join(project, '.agents/skills/local-example/SKILL.md')), {
      code: 'ENOENT',
    });
  });
});

test('target selection removes only unchanged owned files and preserves unrelated client config', async () => {
  await fixture(async (project) => {
    await writeFile(join(project, '.claude/settings.json'), '{"custom":true}\n');
    await writeFile(join(project, '.ai-rules/project/tools.json'), '{"targets":["codex"]}');
    await syncToolkit(project);
    await access(join(project, '.agents/skills/engineering-bug-fix/SKILL.md'));
    await assert.rejects(access(join(project, '.claude/agents/engineering-boundary-reviewer.md')), {
      code: 'ENOENT',
    });
    assert.equal(
      await readFile(join(project, '.claude/settings.json'), 'utf8'),
      '{"custom":true}\n',
    );
    await syncToolkit(project, { check: true });
  });
});

test('symlink destinations and duplicate capability names are rejected', async () => {
  await fixture(async (project, temporary) => {
    await addSkill(project, 'engineering-bug-fix');
    await assert.rejects(syncToolkit(project), /Duplicate capability/);
    await rm(join(project, '.ai-rules/project/skills'), { recursive: true });
    await rm(join(project, '.cursor'), { recursive: true });
    const outside = join(temporary, 'outside');
    await mkdir(outside);
    await symlink(outside, join(project, '.cursor'));
    await assert.rejects(syncToolkit(project), /Refuse symlink/);
    await assert.rejects(access(join(outside, 'skills')), { code: 'ENOENT' });
  });
});

test('a source-only checkout can regenerate ignored outputs without changing tracked sources', async () => {
  await fixture(async (project) => {
    await exec('git', ['-c', 'init.defaultBranch=main', 'init', '--quiet'], { cwd: project });
    await exec('git', ['add', '.'], { cwd: project });
    const tracked = (await exec('git', ['ls-files'], { cwd: project })).stdout.split('\n');
    assert.ok(tracked.includes('.ai-rules/clients.json'));
    assert.ok(tracked.includes('.ai-rules/core/skills/engineering-bug-fix/SKILL.md'));
    assert.ok(tracked.includes('tooling/rules-kit/setup.mjs'));
    const manifest = JSON.parse(
      await readFile(join(project, '.ai-rules/.toolkit-generated.json'), 'utf8'),
    );
    for (const path of Object.keys(manifest.files)) {
      assert.ok(!tracked.includes(path), path + ' must not be tracked');
      await rm(join(project, path));
    }
    assert.ok(!tracked.includes('.ai-rules/.toolkit-generated.json'));
    await rm(join(project, '.ai-rules/.toolkit-generated.json'));
    await syncToolkit(project);
    await syncToolkit(project, { check: true });
    await exec('git', ['diff', '--exit-code'], { cwd: project });
  });
});

test('registry extension and local targets support another skill client without changing shared selection', async () => {
  await fixture(async (project) => {
    const registryPath = join(project, '.ai-rules/clients.json');
    const registry = JSON.parse(await readFile(registryPath, 'utf8'));
    registry.clients['team-ai'] = {
      label: 'Example team AI',
      entry: '.team-ai/rules.md',
      skillRoot: '.team-ai/skills',
      instruction: { path: '.team-ai/rules.md', header: '' },
    };
    await writeFile(registryPath, JSON.stringify(registry));
    await writeFile(join(project, '.ai-rules/tools.local.json'), '{"targets":["team-ai"]}');
    const result = await syncToolkit(project);
    assert.deepEqual(result.targets, ['team-ai']);
    await access(join(project, '.team-ai/skills/engineering-bug-fix/SKILL.md'));
    await access(join(project, '.team-ai/rules.md'));
    const ignore = await readFile(join(project, '.gitignore'), 'utf8');
    assert.match(ignore, /\/\.team-ai\/skills\//);
    assert.match(ignore, /\/\.team-ai\/rules.md/);
    assert.deepEqual(JSON.parse(await readFile(registryPath, 'utf8')).defaults, registry.defaults);
    await syncToolkit(project, { check: true });
  });
});

test('other repository-aware tools get a generic entry; unknown or unsafe adapters fail explicitly', async () => {
  await fixture(async (project) => {
    const local = join(project, '.ai-rules/tools.local.json');
    await writeFile(local, '{"targets":["generic"]}');
    await syncToolkit(project);
    const path = '.ai-rules/generated/INSTRUCTIONS.md';
    assert.match(await readFile(join(project, path), 'utf8'), /AGENTS.md/);
    assert.ok(!(await listDocuments(project)).some((page) => page.path === path));
    await writeFile(local, '{"targets":["unknown-client"]}');
    await assert.rejects(syncToolkit(project), /Registered:.*generic/);
    const registryPath = join(project, '.ai-rules/clients.json');
    const registry = JSON.parse(await readFile(registryPath, 'utf8'));
    registry.clients.generic.instruction.path = '.git/config.md';
    await writeFile(registryPath, JSON.stringify(registry));
    await assert.rejects(syncToolkit(project), /Unsafe or missing client output/);
  });
});
