import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { exportRules } from './export.mjs';
import { diagnoseToolkit } from './doctor.mjs';

const exec = promisify(execFile);
async function fixture(run) {
  const temporary = await mkdtemp(join(tmpdir(), 'rules-doctor-'));
  try {
    await run(await exportRules(join(temporary, 'project')));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

test('exported setup includes usable entries for every default client and a working diagnosis CLI', async () => {
  await fixture(async (project) => {
    const result = await diagnoseToolkit(project);
    assert.equal(result.ok, true, result.errors.join('\n'));
    assert.deepEqual(
      result.clients.map((client) => client.id),
      ['codex', 'claude', 'cursor', 'copilot'],
    );
    const before = await readFile(join(project, '.ai-rules/.toolkit-generated.json'), 'utf8');
    const { stdout } = await exec(process.execPath, ['tooling/rules-kit/doctor.mjs'], {
      cwd: project,
    });
    assert.match(stdout, /AI setup: PASS/);
    assert.match(stdout, /not AI login/);
    assert.equal(
      await readFile(join(project, '.ai-rules/.toolkit-generated.json'), 'utf8'),
      before,
    );
  });
});

test('diagnosis reports missing source entries instead of treating generated skills as complete setup', async () => {
  await fixture(async (project) => {
    await rm(join(project, 'CLAUDE.md'));
    const result = await diagnoseToolkit(project);
    assert.equal(result.ok, false);
    assert.ok(result.errors.includes('Missing Claude Code entry: CLAUDE.md'));
    await assert.rejects(
      exec(process.execPath, ['tooling/rules-kit/doctor.mjs'], { cwd: project }),
      (error) => error.code === 1 && /Missing Claude Code entry/.test(error.stdout),
    );
  });
});

test('diagnosis leaves hand-edited generated files intact and reports selector drift', async () => {
  await fixture(async (project) => {
    const path = join(project, '.claude/skills/engineering-plan/SKILL.md');
    await writeFile(path, 'local edits\n');
    const result = await diagnoseToolkit(project);
    assert.equal(result.ok, false);
    assert.match(result.errors.join('\n'), /hand-edited or unowned/);
    assert.equal(await readFile(path, 'utf8'), 'local edits\n');
    const entry = join(project, '.ai-rules/README.md');
    const stale = (await readFile(entry, 'utf8')).replace(
      'Planning and User Review',
      'Outdated title',
    );
    await writeFile(entry, stale);
    const drift = await diagnoseToolkit(project);
    assert.match(drift.errors.join('\n'), /selector is stale/);
    assert.equal(await readFile(entry, 'utf8'), stale);
  });
});
